import React, {useContext} from 'react'
import { AppContext } from '../../context/AppProvider'

import ListItem from './ListItem'
import ListTree from './ListTree'
interface ListProps {

}
let List: React.FC<ListProps> = (props) => {
    let {data} = useContext(AppContext)
    return(
        <ul className="wds-list wds-visible">
            {
                data
                .map((favorites: IBookmark) => {
                    if(favorites.hasOwnProperty('children')){
                        return <React.Fragment key={favorites.id}>
                            <ListItem value={favorites} space={1}/>
                            <ListTree value={favorites} space={1}/>
                        </React.Fragment> 
                    }else{
                        return <ListItem value={favorites} space={1}/>
                    }
                })
            }
        </ul>
    )
}
export default List