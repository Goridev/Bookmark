import { useContext } from "react"
import { useEffect } from "react"
import { AppContext } from "../../context/AppProvider"

interface GlobalEventsProps{

}
let GlobalEvents: React.FC<GlobalEventsProps> = (props) =>{
    let {updateData} = useContext(AppContext)
    useEffect(()=>{
        window.addEventListener('keypress',(e: KeyboardEvent)=>{
            if(e.key === "Enter" && (document.getElementById('update-field') as HTMLInputElement)!==null){
                // console.log(e.key)
                let input: HTMLInputElement = document.getElementById('update-field') as HTMLInputElement
                let parent: HTMLElement = input.parentElement 
                if(parent.dataset.type === "tree"){
                    let p = document.createElement('p')
                    updateData(parent.dataset.treeId,{title: input.value})
                    p.textContent = input.value;
                    parent.replaceChild(p,input);
                }else{
                    let link = document.createElement('a')
                    updateData(parent.dataset.treeId,{title: input.value})
                    link.href = parent.dataset.url;
                    link.target = "_blank"
                    link.rel = "noopener noreferrer"
                    link.textContent = input.value;
                    parent.replaceChild(link,input);
                }
            }
        })
    },[])
    return(
        <>
            {props.children}
        </>
    )
}
export default GlobalEvents