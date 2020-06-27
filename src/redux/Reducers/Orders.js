/**
 * Created by nikolasvamvou on 6/17/20.
 */
import store from '../Store/StoreConf'


const orders = (state = store.getState(), action)=>{
    switch(action.type){
        case 'ADD_OPEN_ORDER':
            return {
                ...state,
                currentDayOrders : [
                    {
                        id : action.openOrder.id,
                        time : action.openOrder.time,
                        date : action.openOrder.date,
                        price : action.openOrder.totalPrice,
                        status : action.openOrder.status,
                        store : action.openOrder.store
                    },
                    ...state.currentDayOrders,

                ]
            }

        case 'UPDATE_ORDER_STATUS':
            return{
                ...state,
                currentDayOrders:state.currentDayOrders.map((order, i)=>
                    order.id === action.orderId ? {...order, status : action.status} : order
                )
            }

        case 'UPDATE_RESTAURANT_LOCATION' :
            return {
                ...state,
                restaurantLocation : action.restaurantLocation
            }

        case 'CLEAR_ORDERS':
            return {
                ...state,
                currentDayOrders:[]
            }
        case 'LOG_USER':
            return{
                ...state,
                userLoggedIn:true
            }

    }
    //in case the action does not match return default
    return state;
}


export default orders;