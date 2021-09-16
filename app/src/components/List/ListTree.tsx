import React from "react"
import ListItem from "./ListItem"

interface ListTreeProps{
    value: IBookmark
    space:number,
}
let ListTree:React.FC<ListTreeProps> = (props) => {
    return(
        <ul className={`wds-list-child wds-space-${props.space} close`} data-parent-id={props.value.id}>
            {
                props.value.children
                .map((favorites: IBookmark) => {
                    if(favorites.hasOwnProperty('children')){
                        return <React.Fragment key={favorites.id}> 
                            <ListItem value={favorites} space={props.space++}/>
                            <ListTree value={favorites} space={props.space++}/>
                        </React.Fragment> 
                    }else{
                        return <ListItem value={favorites} space={props.space++}/>
                    }
                })
            }
        </ul>
    )
}
export default ListTree