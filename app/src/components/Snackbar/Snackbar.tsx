import { useEffect } from "react"
import { useContext } from "react"
import { AppContext } from "../../context/AppProvider"

interface SnackbarProps{

}
let Snackbar:React.FC<SnackbarProps> = (props) => {
    let {snackbar} = useContext(AppContext)
    useEffect(()=>{
        console.log("[Snackbar]",snackbar)
    },[snackbar])
    
    return(
        <div className={`wds-snackbar ${snackbar.active?"show":"close"}`}>
            {snackbar.message}
        </div>
    )
}
export default Snackbar