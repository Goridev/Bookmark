import React from "react"
import { useContext } from "react"
import { AppContext } from "../../context/AppProvider"
import ListItemFavicon from "./ListItemFavicon"

interface ListItemProps{
    value: IBookmark,
    space: number
}
let ListItem: React.FC<ListItemProps> = (props) => {
    let {updateConfirm,updateFavicon,prompt} = useContext(AppContext)
    async function onClick (event: React.MouseEvent<HTMLLIElement>){
        let childs: HTMLCollection = document.getElementsByClassName('wds-list-child') as HTMLCollection 
        for(let k=0;k<childs.length;k++){
            if((childs.item(k) as HTMLElement).dataset.parentId === (event.currentTarget as HTMLElement).dataset.treeId){
                if(!(childs[k]as HTMLElement).classList.contains('show')){
                    (childs[k]as HTMLElement).classList.remove('close');
                    (childs[k]as HTMLElement).classList.add('show')
                }else{
                    (childs[k]as HTMLElement).classList.remove('show');
                    (childs[k]as HTMLElement).classList.add('close')
                }
            }
        }
    }
    async function onRemove(event: React.MouseEvent<SVGSVGElement>){
        event.preventDefault()
        event.stopPropagation()
        updateConfirm({
            id:event.currentTarget.parentElement.dataset.treeId,
            active:true,
            response:null,
            content:{
                title:`Suppression`,
                message:`Voulez-vous supprimer ${event.currentTarget.parentElement.dataset.title} ?`
            },
            action: "remove",
            title:event.currentTarget.parentElement.dataset.title
        })
    } 
    async function onEdit(event: React.MouseEvent<SVGSVGElement>){
        event.preventDefault()
        event.stopPropagation()
        updateConfirm({
            id:event.currentTarget.parentElement.dataset.treeId,
            active:true,
            response:null,
            content:{
                title:`Édition`,
                message:`Voulez-vous éditer ${event.currentTarget.parentElement.dataset.title} ?`
            },
            action:"update",
            title:event.currentTarget.parentElement.dataset.title
        })
    }
    async function onDragListItem(event: React.DragEvent<HTMLLIElement>){
        console.log("[X]",event.pageX,"[Y]",event.pageY)
    }

    if(props.value.type !== "tree"){
        return(
            <li className={`wds-element wds-no-child wds-visible wds-sapce-${props.space}`} data-title={props.value.title} data-url={props.value.url} data-tree-id={props.value.id} data-parent-id={props.value.parentId} data-type={"element"} draggable={true} onDragOver={onDragListItem}>
                <span>
                    <a href={props.value.url} target="_blank" rel="noreferrer">
                        {(props.value.title.length>=36)?props.value.title.substring(0,33)+"...":props.value.title.substring(0,33)}
                    </a>
                </span> 
                <ListItemFavicon value={props.value}/>
                <svg viewBox="0 0 24 24" className="wds-icon wds-icon-trash" onClick={onRemove}>
                    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                </svg>
                <svg viewBox="0 0 24 24" className="wds-icon wds-icon-edit" onClick={onEdit}>
                    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
                </svg>
            </li>
        )
    }else{
        return(
            <li onClick={onClick} className={`wds-element wds-tree wds-visible wds-sapce-${props.space}`} data-title={props.value.title} data-tree-id={props.value.id} data-parent-id={props.value.parentId} data-type={"tree"}>
                <svg x="0px" y="0px" viewBox="0 0 468.293 468.293"  className="wds-icon wds-icon-folder">
                    <path style={{fill:"#F6C358"}} d="M29.525,50.447h111.996c7.335,0,14.11,3.918,17.77,10.274l18.433,25.181
                        c3.66,6.356,10.436,10.274,17.77,10.274h272.798v287.495c0,15.099-12.241,27.34-27.34,27.34H27.34
                        C12.241,411.011,0,398.77,0,383.671V128.068c0-21.133,3.265-42.14,9.68-62.276l0,0C12.03,56.755,20.188,50.447,29.525,50.447z"/>
                    <rect x="42.615" y="91.473" style={{fill:"#EBF0F3"}} width="359.961" height="152.058"/>
                    <path style={{fill:"#FCD462"}} d="M447.788,64.117H334.927c-8.026,0-15.315,4.683-18.65,11.983l-19.313,42.267
                        c-3.336,7.3-10.624,11.983-18.65,11.983H0v260.155c0,15.099,12.241,27.34,27.34,27.34h413.613c15.099,0,27.34-12.241,27.34-27.34
                        V84.622C468.293,73.298,459.112,64.117,447.788,64.117z"/>
                </svg>
                <p>
                    {props.value.title}
                </p>
                <svg viewBox="0 0 24 24" className="wds-icon wds-icon-trash" onClick={onRemove}>
                    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                </svg>
                <svg viewBox="0 0 24 24" className="wds-icon wds-icon-edit" onClick={onEdit}>
                    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
                </svg>
                <svg className="wds-icon wds-icon-expand-more" viewBox="0 0 24 24">
                    <path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/>
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/>
                </svg>
            </li>
        )
    }
}
export default ListItem
