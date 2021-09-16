/* eslint-disable no-useless-computed-key */
import React,{createContext, FC, useEffect, useState} from 'react'


export interface AppProps{
    window?: () => Window;
  children?: React.ReactElement;
}
export type AppContextType = {
    data:IBookmark[]
    update:(order: "alphabet"|"category"|"none") => void
    updateFavicon: (item:{url: string,title: string})=> void
    removeData:(id: string,title:string) => void
    updateData:(id: string,item:{title:string,url?:string}) => void
    confirm: Modal
    updateConfirm:(confirm: Modal) => void
    prompt: Modal
    updatePrompt: (prompt: Modal) => void
    snackbar: Snackbar
    updateSnackbar: (message: string) => void
}
const default_state: IBookmark[] = []

export const AppContext = createContext<AppContextType>({
    data: default_state,
    update:(order: "alphabet"|"category"|"none") => {},
    updateFavicon: (item:{url: string,title: string})=> {},
    removeData:(id: string,title:string)=>{},
    updateData:(id:string,item:{title:string,url?:string})=>{},
    confirm: {
        id:"",
        active: false,
        response: null,
        content:{title:"",message:""},
        action: null,
        title:""
    },
    updateConfirm:(confirm: Modal) => {},
    prompt: {
        id:"",
        active: false,
        response: null,
        content:{title:"",message:""},
        action: null,
        title:""
    },
    updatePrompt: (prompt: Modal) => {},
    snackbar:{active:false,message:""},
    updateSnackbar: (message: string) => {},
});
const AppProvider: FC<AppProps> = (props) => {
    const [data,setData] = useState<IBookmark[]>(default_state)
    const [snackbar,setSnackbar] = useState<Snackbar>({active:false,message:""})
    const [confirm,setConfirm] = useState<Modal>({id:"",active:false,response:null,content:{title:"",message:""},action: null,title:""})
    const [prompt,setPrompt] = useState<Modal>({id:"",active:false,response:null,content:{title:"",message:""},action: null,title:""})
    function orderByCategory(a: IBookmark,b: IBookmark): number{
        if(a.hasOwnProperty('children')){
            return 1
        }else{
            return -1
        }
    }
    function orderByAlphabet(a: IBookmark,b: IBookmark): number{
        if(a.title.codePointAt(0) > b.title.codePointAt(0)){
            return 1
        }else{
            return -1
        }
    }
    async function updateSnackbar(message?: string){
        if(message!==undefined){
            setSnackbar({
                active:!snackbar.active,
                message: message
            })
        }else{
            setSnackbar({
                active:false,
                message: ""
            })
        }
    }
    async function updatePrompt(prompt: Modal){
        setPrompt(prompt)
    }
    async function updateConfirm(item: Modal){
        if(item.response !== null){
            if(item.response===true && item.action === "remove"){
                removeData(item.id,item.title)
            }
        }
        setConfirm(item)
    }
    async function updateData(id: string,item:{title:string,url?:string}){
        chrome.bookmarks.update(id,item).then((value)=>{
            update("none")
            updateSnackbar(`${item.title} a été modifié`)
            setTimeout(()=>{
                updateSnackbar()
            },2000)
        })
    }
    async function removeData(id: string,title:string){
        chrome.bookmarks.remove(id).then(()=>{
            update("none")
            updateSnackbar(`${title} a été supprimé`)
            setTimeout(()=>{
                updateSnackbar()
            },2000)
        })
    }
    
    async function dispatchSort(value?:chrome.bookmarks.BookmarkTreeNode[],sortType?: Sort,prevDepth?: number): Promise<IBookmark[]>{
        switch(sortType){
            case "alphabet":
                value.sort(orderByAlphabet)
                return mapping(value,sortType,prevDepth)
            case "category":
                value.sort(orderByCategory)
                return mapping(value,sortType,prevDepth)
            case "none" || undefined:
                return mapping(value,undefined,prevDepth)
            default:
                return mapping(value,undefined)
        }
    }
    async function mapping(value?:chrome.bookmarks.BookmarkTreeNode[] | IBookmark[],sortType?: Sort,prevDepth?:number): Promise<IBookmark[]>{
        let depth = prevDepth!==undefined?(prevDepth+1):0;
        value.map((item: IBookmark) => {
            if(item.hasOwnProperty('children')){
                depth++;
                item.type = "tree"
                item.category = "default"
                item.level = depth
                item.favicon = ""
                dispatchSort(item.children,sortType,depth--)
            }else{
                item.type = "element"
                item.category = "default"
                item.favicon = ""
                item.level = (item.parentId!=="1")?depth:0
            }
        })
        let bookmark: IBookmark[] = value
        return bookmark
    }
    async function updateFavicon(item:{url: string,title:string}){
        // chrome.storage.local.set({
        //     addFavicon: {
        //         url: item.url,
        //         title: item.title
        //     }
        // })
        chrome.runtime.sendMessage({
            message:"updateFavicon",
            payload: item
        },response => {
            console.log(`[AppProivder] [PostMessage] -> updateFavicon`,response)
        })
    }
    async function update(order?: Sort){
        let result = await getMain(order)
        console.log(`[AppProvider] [UPDATE] sort by %c[${order}]`,"color: #198754")
        console.log(`[AppProvider] [UPDATE]`,result)
        chrome.storage.local.set({
            collection:result
        })
        setData(result)
    }
    async function getMain(sortType?:Sort): Promise<IBookmark[]>{
        return new Promise(async (resolve,reject)=>{
            await chrome.runtime.sendMessage({
                message: "getMain",
                payload: sortType
            },response=>{
                console.log(`[AppProivder] [PostMessage] -> getMainResponse`,response.payload)
                resolve(dispatchSort(response.payload,sortType))
            })
        })
    }
    useEffect(()=>{
        (async()=>{
            await update()
        })()
        // chrome.storage.onChanged.addListener((change)=>{
        //     console.log("[AppProvider] [chrome.storage.onChanged]",change)
        //     update()
        // })
        chrome.bookmarks.onCreated.addListener((id: string, bookmark: chrome.bookmarks.BookmarkTreeNode)=>{
            console.log("[chrome.bookmarks.onCreated]",bookmark.title)
            update()
        })
        chrome.bookmarks.onChanged.addListener((id: string, bookmark: chrome.bookmarks.BookmarkTreeNode)=>{
            console.log("[chrome.bookmarks.onChanged]",bookmark.title)
            update()
        })
    },[])

    return(
        <AppContext.Provider value={
                {
                    data:data,
                    updateFavicon:updateFavicon,
                    removeData:removeData,
                    updateData:updateData,
                    update:update,
                    confirm:confirm,
                    updateConfirm:updateConfirm,
                    prompt: prompt,
                    updatePrompt:updatePrompt,
                    snackbar: snackbar,
                    updateSnackbar: updateSnackbar,
                }
            }>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppProvider
