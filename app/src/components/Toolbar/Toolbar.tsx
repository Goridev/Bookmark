import React from "react"
import { useContext } from "react"
import { AppContext } from "../../context/AppProvider"
import Tooltip from "../Tooltips/Tooltip"

interface ToolbarProps{

}
let Toolbar: React.FC<ToolbarProps> = (props) => {
    let {update,updatePrompt} = useContext(AppContext)
    async function showListFiltered(){
        let m = document.querySelector('.wds-list') as HTMLElement
        let q = document.querySelector('.wds-list-query') as HTMLElement

        m.classList.remove('wds-visible')
        m.classList.add('wds-hidden')
        q.classList.remove('wds-hidden')
        q.classList.add('wds-visible')
        document.body.style.backgroundPosition = "bottom 0 left 0"
        document.body.style.transition = "all 500ms cubic-bezier(0, 0.110, 0.35, 2)"
    }
    async function hideListfiltered(){
        let m = document.querySelector('.wds-list') as HTMLElement
        let q = document.querySelector('.wds-list-query') as HTMLElement
        q.classList.remove('wds-visible')
        q.classList.add('wds-hidden')
        m.classList.remove('wds-hidden')
        m.classList.add('wds-visible')
        document.body.style.backgroundPosition = "bottom 0 right 0"
        document.body.style.transition = "all 500ms cubic-bezier(0, 0.110, 0.35, 2)"
    }
    async function clearListFiltered(){
        let q = document.querySelector('.wds-list-query') as HTMLElement
        q.innerHTML = ''
    }
    async function fillListFiltered(element: HTMLElement){
        let q = document.querySelector('.wds-list-query') as HTMLElement // root
        let copy = element.cloneNode(true)
        q.appendChild(copy)
    }
    async function onInput(event: React.SyntheticEvent<HTMLInputElement>){
        clearListFiltered()
        let collectionOfNoChild: Array<HTMLElement> = []
        let noChilds: HTMLCollection = document.getElementsByClassName('wds-no-child') as HTMLCollection
        for(let a=0;a<noChilds.length;a++){
            let textContent: string = noChilds.item(a).children.item(0).textContent
            textContent.toLowerCase()
            try {
                if(event.currentTarget.value.length <= 0){
                    hideListfiltered()
                }else if(textContent.toLowerCase().startsWith(event.currentTarget.value.toLowerCase()) || textContent.toLowerCase().includes(event.currentTarget.value.toLowerCase())){
                    showListFiltered()
                    collectionOfNoChild.push(noChilds.item(a) as HTMLElement)
                }
            } catch (error) {
                console.error(new Error("Erreur dans la matrice"))
            }
            setCurrentQuery(event.currentTarget.value)
        }
        for(let b=0;b<collectionOfNoChild.length;b++){
            fillListFiltered(collectionOfNoChild[b] as HTMLElement)
        }
    }
    async function onBlur(event: React.FocusEvent<HTMLInputElement>){
        setCurrentQuery(event.target.value)
        event.target.value = ""
        event.target.placeholder = ""
    }
    async function onFocus(event: React.FocusEvent<HTMLInputElement>){
        chrome.storage.local.get('query',data => {
            if(data.query.length > 0){
                event.target.value = data.query
            }else{
                event.target.placeholder = "Rechercher..."
            }
        })
    }
    async function setCurrentQuery(value: string){
        chrome.storage.local.set({
            query: value
        })
    }
    async function refresh(event: React.MouseEvent<HTMLElement>){
        update("none")
    }
    async function showCollapse(event: React.MouseEvent<HTMLElement>){
        let collapse = document.querySelector('.wds-toolbar-collapse')
        if(collapse.classList.contains('show')){
            collapse.classList.remove('show')
            collapse.classList.add('close')

        }else{
            collapse.classList.remove('close')
            collapse.classList.add('show')
        }
    }
    async function onEditCategory(event: React.MouseEvent<SVGSVGElement>){
        event.preventDefault()
        event.stopPropagation()
        updatePrompt({
            id:event.currentTarget.parentElement.dataset.treeId,
            active:true,
            response:null,
            content:{
                title:`Ajouter un catégorie`,
                message:`Voulez-vous ajouter une catégorie à ${event.currentTarget.parentElement.dataset.title} ?`
            },
            action:"prompt",
            title:event.currentTarget.parentElement.dataset.title
        })
        console.log(prompt)
    }
    return(
        <div className="wds-toolbar">
            <div className="wds-toolbar-action wds-search-box">
                <div className="wds-toolbar-action wds-btn-search">
                    <svg className="wds-icon wds-icon-query" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                </div>
                <input onInput={onInput} onBlur={onBlur} onFocus={onFocus} placeholder="" id="query-field" type="text" name="query" className="wds-toolbar-action wds-query-field"/>
            </div>
            <div className="wds-toolbar-action wds-add-category">
                <svg viewBox="0 0 24 24" className="wds-icon wds-icon-add-category" onClick={onEditCategory}>
                    <g clip-path="url(#clip0)">
                        <path d="M12 2L6.5 11H17.5L12 2ZM12 5.84L13.93 9H10.06L12 5.84ZM17.5 13C15.01 13 13 15.01 13 17.5C13 19.99 15.01 22 17.5 22C19.99 22 22 19.99 22 17.5C22 15.01 19.99 13 17.5 13ZM17.5 20C16.12 20 15 18.88 15 17.5C15 16.12 16.12 15 17.5 15C18.88 15 20 16.12 20 17.5C20 18.88 18.88 20 17.5 20ZM3 21.5H11V13.5H3V21.5ZM5 15.5H9V19.5H5V15.5Z" fill="#F6F6F6"/>
                        <path d="M6.5 6.5H3.5V9.5H2.5V6.5H-0.5V5.5H2.5V2.5H3.5V5.5H6.5V6.5Z" fill="#F6F6F6"/>
                    </g>
                    <defs>
                        <clipPath id="clip0">
                        <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
            
            <div className="wds-toolbar-action wds-refresh" onClick={refresh}>
                <svg className="wds-icon wds-icon-refresh" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
            </div>
            <div className="wds-toolbar-action wds-filter" onClick={showCollapse}>
                <svg className="wds-icon wds-icon-filter" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                </svg>
            </div>
            <div className="wds-toolbar-collapse close" tabIndex={Math.floor(Math.random()*100)}>
                <div className="wds-toolbar-action wds-filter-category" onClick={()=>update("category")}>
                    <Tooltip text={"By Category"} position={"left"}>
                        <svg viewBox="0 0 24 24" className="wds-icon wds-icon-filter-category">
                            <path d="M0 0h24v24H0V0z" fill="none"/>
                            <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/>
                        </svg>
                    </Tooltip>
                </div>
                <div className="wds-toolbar-action wds-filter-alphabet" onClick={()=>update("alphabet")}>
                    <Tooltip text={"By Alphabet"} position={"left"}>
                        <svg className="wds-icon wds-icon-filter-alphabet" viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/>
                            <path d="M15.75 5h-1.5L9.5 16h2.1l.9-2.2h5l.9 2.2h2.1L15.75 5zm-2.62 7L15 6.98 16.87 12h-3.74zM6 20l3-3H7V4H5v13H3l3 3z"/>
                        </svg>
                    </Tooltip>
                    
                </div>
            </div>
        </div>
    )
}
export default Toolbar