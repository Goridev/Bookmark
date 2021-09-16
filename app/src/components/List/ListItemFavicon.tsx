import { useContext } from "react"
import { AppContext } from "../../context/AppProvider"

interface ListItemFaviconProps{
    value: IBookmark
}
let ListItemFavicon: React.FC<ListItemFaviconProps> = (props) => {
    let {updateFavicon} = useContext(AppContext)
    async function addFavicon(event: React.MouseEvent<SVGSVGElement>){
        console.log(props.value.url,props.value.title)
        updateFavicon({title:props.value.url,url:props.value.title})
    }
    if(props.value.favicon.length > 0){
        return(
            <img className="wds-icon wds-icon-favicon" src={props.value.favicon} alt={props.value.id} />
        )
    }else{
        return( 
            <svg viewBox="0 0 24 24" className="wds-icon wds-icon-favicon-add" onClick={addFavicon}>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M21 6h-3.17L16 4h-6v2h5.12l1.83 2H21v12H5v-9H3v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM8 14c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5-5 2.24-5 5zm5-3c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3zM5 6h3V4H5V1H3v3H0v2h3v3h2z"/>
            </svg>
        )
    }
    
}
export default ListItemFavicon