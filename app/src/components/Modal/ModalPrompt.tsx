import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppProvider'
interface ModalPromptProps{

}
let ModalPrompt: React.FC<ModalPromptProps> = (props) => {
    let {prompt,updatePrompt} = useContext(AppContext)
    async function save(event: React.MouseEvent<HTMLButtonElement>){
        updatePrompt({
            id:prompt.id,
            active: false,
            response: (document.getElementById('create-category') as HTMLInputElement).value,
            content:{
                title: "",
                message: ""
            },
            title:"",
            action: "prompt",
        })
    }
    async function exitModal(event: React.MouseEvent<HTMLElement>){
        updatePrompt({
            id:prompt.id,
            active: false,
            response: null,
            content:{
                title: "",
                message: ""
            },
            title:"",
            action: "prompt",
        })
    }
    return(
        <React.Fragment>
            
            <div className={`wds-backdrop ${prompt.active?"":"wds-hidden"} `} onClick={exitModal}>
                <div className={`wds-modal-prompt ${prompt.active?"":"wds-hidden"}`}>
                    <header className="wds-modal-title">
                        <p className="wds-modal-text">{prompt.content.title}</p>
                    </header>
                    <main className="wds-modal-body">
                        <form noValidate className={`wds-form-prompt`}>
                            <div className={`wds-field-box`}>
                                <input type="text" className={`wds-prompt-field`} id={`create-category`} placeholder={`Nouvelle catégorie`} />
                                <span className={`wds-underline-field`}></span>
                            </div>
                        </form>
                    </main>
                    <footer className="wds-modal-footer">
                        <button className="wds-modal-button" onClick={save}>
                            <p>Sauvegarder</p>
                            <span className="wds-modal-button-underline"></span>
                        </button>
                        <button className="wds-modal-button" onClick={exitModal}>
                            <p>Quitter</p>
                            <span className="wds-modal-button-underline"></span>
                        </button>
                    </footer>
                </div>
            </div>
        </React.Fragment>
    )
}
export default ModalPrompt