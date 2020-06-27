/**
 * Created by nikolasvamvou on 6/17/20.
 */
import {createStore} from 'redux'
import orders from '../Reducers/Orders'

import { combineReducers } from 'redux'


const initialState = {
    userLoggedIn : false,
    currentDayOrders : [],
    adminView:true,
    restaurantLocation : ''
}

const store = createStore(orders, initialState);

export default store;