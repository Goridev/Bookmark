let currentTab: chrome.tabs.Tab;
async function mapping(value?:chrome.bookmarks.BookmarkTreeNode[] | IBookmark[],prevDepth?:number): Promise<IBookmark[]>{
    return new Promise((resolve,reject)=>{
        let depth = (prevDepth!==undefined&&prevDepth>0)?(prevDepth+1):0;
        value.map(async (item: IBookmark) => {
            if(item.hasOwnProperty('children')){
                depth++;
                item.type = "tree";
                item.category = "default";
                item.level = depth;
                item.favicon = ""
                mapping(item.children as IBookmark[],depth--);
            }else{
                if(currentTab!==undefined && item.title === currentTab.title){
                    item.favicon = currentTab.favIconUrl
                }else{
                    item.favicon = ""
                }
                item.type = "element";
                item.category = "default";
                item.level = (item.parentId!=="1")?depth:0;
            }
            let bookmark: IBookmark[] = value
            resolve(bookmark)
        })
    })
}
async function getMain(): Promise<IBookmark[]>{
    let bookmark = await chrome.bookmarks.getTree()
    let favorites = bookmark[0].children[0].children
    let other = bookmark[0]?.children[1].children
    favorites?.concat(other)
    return mapping(favorites,undefined)
}
async function removeBookmark(title: string) {
    let result = await chrome.bookmarks.search(title)
    await chrome.bookmarks.remove(result[0].id)
    updateContextMenuAdd()
}
async function addBookmark(tab: chrome.tabs.Tab){
    await chrome.bookmarks.create({title:tab.title,url:tab.url,parentId:"1"})
    console.log("[Background] [addBookmark] [Favicon]",tab.favIconUrl)
    updateContextMenuRemove()
}
async function updateContextMenuAdd(){
    chrome.contextMenus.update('remove',{enabled:false})
    chrome.contextMenus.update('add',{enabled:true})
    updateStorage()
}
async function updateContextMenuRemove(){
    chrome.contextMenus.update('add',{enabled: false})
    chrome.contextMenus.update('remove',{enabled:true})
    updateStorage()
}
async function updateStorage(){
    let main = await getMain()
    console.log(`[Background] [Storage] set`,main)
    chrome.storage.local.set({
        collection:main
    })
}
try { 
    chrome.runtime.onInstalled.addListener(async (details)=>{
        await updateStorage()
    })
    chrome.contextMenus.create({ 
        id:"add",
        title: "Ajouter aux favoris",
        contexts: ["all"],
        enabled: true,
        type: "normal"
    })
    chrome.contextMenus.create({ 
        id:"remove",
        title: "Supprimer des favoris",
        contexts: ["all"],
        enabled: false,
        type: "normal"
    })
    chrome.tabs.onActivated.addListener(info=>{
        chrome.tabs.get(info.tabId).then(tab => {
            console.log(`[Background]  [activeTab]`,tab)
            chrome.bookmarks.search(tab.title,(result)=>{
                result.length > 0 ? updateContextMenuRemove() : updateContextMenuAdd()
            })
        })
    })
    chrome.storage.onChanged.addListener(async (change,areaName)=>{
        if(change.hasOwnProperty('addFavicon')){
            console.log("[Background] [chrome.storage.onChanged]",change)
        }
        updateStorage()
    })
    chrome.bookmarks.onRemoved.addListener((id,removeInfo)=>{
        console.log(`[Background]  [remove] [${id}]`,removeInfo)
        updateStorage()
    })
    chrome.bookmarks.onCreated.addListener((id,createdInfo)=>{
        console.log(`[Background]  [created] [${id}]`,createdInfo)
        updateStorage()
    })
    chrome.contextMenus.onClicked.addListener((info,tab)=>{
        console.log(`[Background]  contextMenu [onClick]`,info.menuItemId)
        console.log(`[Background]  contextMenu [onClick]`,tab.favIconUrl)
        currentTab = tab
        // tree.setCurrentTab(tab)
        switch(info.menuItemId as ACTION){
            case "add":
                addBookmark(tab)
                break;
            case "remove":
                removeBookmark(currentTab.title)
                break;
            case 'update':
                break;
            default:
                return;
        }
    })
    chrome.commands.onCommand.addListener((cmd,tab) => {
        console.log(`[Background]  [onCommand] %c${cmd}`,'color:red;')
        addBookmark(tab)
    })
    chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{ 
        switch(request.message){
            case "getMain":
                if(chrome.runtime.lastError)console.error(`[Background] getMain`,chrome.runtime.lastError.message);
                console.log(`[Background] [onMessage] -> getMain ${request.payload}`,'color: red')
                getMain().then(value =>{
                    setTimeout(()=>{
                        sendResponse({message: "getMainResponse",payload:value})
                    },100)
                })
                break;
            case "updateFavicon":
                if(chrome.runtime.lastError)console.error(`[Background] updateFavicon`,chrome.runtime.lastError.message);
                console.log("[Background] [onMessage] -> updateFavicon",request.payload)
                sendResponse({message: "updateFaviconSuccess",payload: request.payload})
                break;
            default: 
                return true;
        }
        return true;
    })
} catch (error) {
    console.log(error)
}