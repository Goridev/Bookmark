import React, { useContext } from "react"
import { useState } from "react"
import { AppContext } from "../../context/AppProvider"

interface ModalConfirmProps {
    
}
let ModalConfirm: React.FC<ModalConfirmProps> = (props) => {
    let {confirm,updateConfirm} = useContext(AppContext)
    async function yes(event: React.MouseEvent<HTMLButtonElement>){
        if(confirm.action === "update"){
            updateConfirm({
                id:confirm.id,
                active:!confirm.active,
                response: true,
                content:{
                    title:"",
                    message:""
                },
                action: confirm.action,
                title: confirm.title
            })
            let el: HTMLCollection = document.getElementsByClassName('wds-no-child') as HTMLCollection
            let elo: HTMLCollection = document.getElementsByClassName('wds-tree') as HTMLCollection

            for(let i=0;i<el.length;i++){
                if((el.item(i)as HTMLElement).dataset.treeId === confirm.id){
                    let safeParent = (el.item(i)as HTMLElement)
                    let safeLink = (el.item(i)as HTMLElement).children[0]
                    let content = safeLink.textContent
                    let input: HTMLInputElement = document.createElement('input')
                    input.type = "text"
                    input.value = content
                    input.id = "update-field"
                    safeParent.replaceChild(input,safeLink)
                }
            }
            for(let k=0;k<elo.length;k++){
                if((elo.item(k)as HTMLElement).dataset.treeId === confirm.id){
                    let safeParent = (elo.item(k)as HTMLElement)
                    let safeLink = (elo.item(k)as HTMLElement).children[1]
                    let content = safeLink.textContent
                    let input: HTMLInputElement = document.createElement('input')
                    input.type = "text"
                    input.value = content
                    input.id = "update-field"
                    safeParent.replaceChild(input,safeLink)
                }
            }
        }else{
            updateConfirm({
                id:confirm.id,
                active:!confirm.active,
                response: true,
                content:{
                    title:"",
                    message:""
                },
                action: confirm.action,
                title:confirm.title
            })
        }
    }
    async function no(event: React.MouseEvent<HTMLElement>){
        updateConfirm({
            id:confirm.id,
            active:!confirm.active,
            response: false,
            content:{
                title:"",
                message:""
            },
            action: confirm.action,
            title:confirm.title
        })
    }
    return(
        <React.Fragment>
            <div className={`wds-backdrop ${confirm.active?"":"wds-hidden"} `} onClick={no}>
                <div className={`wds-modal-flex ${confirm.active?"":"wds-hidden"}`}>
                    <header className="wds-modal-title">
                        <p className="wds-modal-text">{confirm.content.title}</p>
                    </header>
                    <main className="wds-modal-body">
                        <p className="wds-modal-text">{confirm.content.message}</p>
                    </main>
                    <footer className="wds-modal-footer">
                        <button className="wds-modal-button" onClick={yes}>
                            <p>Oui</p>
                            <span className="wds-modal-button-underline"></span>
                        </button>
                        <button className="wds-modal-button" onClick={no}>
                            <p>Non</p>
                            <span className="wds-modal-button-underline"></span>
                        </button>
                    </footer>
                </div>
            </div>
        </React.Fragment>
    )
}
export default ModalConfirm