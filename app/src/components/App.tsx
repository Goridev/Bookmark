import React from 'react';
import "../assets/styles/index.scss"
import AppProvider from '../context/AppProvider';
import List from './List/List'
import ListQuery from './List/ListQuery'
import Snackbar from './Snackbar/Snackbar'
import ModalConfirm from './Modal/ModalConfirm'
import Toolbar from './Toolbar/Toolbar';
import GlobalEvents from './_/Event';
import ModalPrompt from './Modal/ModalPrompt';

let App: React.FC<{}> = () => {
    return (
        <AppProvider>
            <GlobalEvents>
               <div className="wds-main">
                    <Toolbar/>
                    <List/>
                    <ListQuery/>
                    <Snackbar/>
                    <ModalConfirm/>
                    <ModalPrompt/>
                </div> 
            </GlobalEvents>
        </AppProvider>
        
    );
}

export default App;
