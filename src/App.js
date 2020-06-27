import React from 'react';
import './scss/style.scss';
import OrdersTable from './components/OrdersTable/OrdersTable'
import {Provider} from 'react-redux'
import store from './redux/Store/StoreConf'
import Router from './components/Rootes/Root'


function App() {
    return (

            <Provider store = {store}>
                <Router>
                <div className="App">
                </div>
                </Router>
            </Provider>

    );
}



export default App;
