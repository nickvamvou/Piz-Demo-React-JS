/**
 * Created by nikolasvamvou on 6/17/20.
 */
import firebase from './DatabaseConf'
import OrdersTable from '../components/OpenOrdersTable/OpenOrdersTable'
import store from '../redux/Store/StoreConf'
import {orderIsGeneratedToday, getOrderDate, getOrderTime, transformOrdersArrayForRenderingPurposes} from './helperFunctions'

let ordersPath = firebase.database().ref('Orders');

/*
 This function listens for new orders

 For every order (intially all existing) and then for the ones added this function is called
 and datasnapshot represents the data of the new order
 */
export let listenToOrdersGeneratedToday = (restaurantLocation, on)=>{
    return new Promise((resolve, reject)=>{
        /*
         TODO add filtering directly from the database instead of retrieving all orders
         because this will become inefficient in the long run

         Start of the day in millisecond - end of the day in milisecond and query like that

         */
        let orders;
        if(on){
            orders = ordersPath.orderByChild('time').startAt(orderIsGeneratedToday()).on('child_added', async (dataSnapshot)=> {
                let order = dataSnapshot.val();

                if(order.restaurantLocation === restaurantLocation){

                    //in case we have a new open order and the order is generated today
                    //add the order id to the object
                    order.id = dataSnapshot.key;
                    let timeInMil = order.time;
                    //update the time of the order based on local time and miliseconds from db
                    order.time = getOrderTime(timeInMil);
                    //add a date to the order object
                    order.date = getOrderDate(timeInMil);
                    store.dispatch({type: 'ADD_OPEN_ORDER', openOrder: order})
                }
                resolve();
            }, (error)=>{

                alert(error.message)
                reject(error);

            })
        }
        else{
            try{
                ordersPath.off("child_added", orders);resolve();
                resolve();
            }
            catch (e) {
                reject();
            }
        }
    })
}

export async function removeListener(listener){
    ordersPath.off("child_added", listener);
}

export async function getOrderInformationById(orderId){
    return new Promise(async (resolve, reject)=>{
        try{
            let orderPath = firebase.database().ref('Orders/' + orderId);
            let res = await orderPath.once('value');
            let order = res.val();
            order.id = orderId;

            resolve(order);
        }
        catch (err){
            reject(err);
        }

    })
}

/*
 Function is used in order to accept an order by updating the status of the order
 */
export async function acceptOrderById(orderId, deliveryTime){
    return new Promise((resolve, reject)=>{
        firebase.database().ref('Orders/' + orderId).update({
            status:"accepted",
            deliveryTime : deliveryTime
        }, function(error) {
            if (error) {
                reject(error);
            } else {
                // Data saved successfully!
                resolve();
            }
        });
    })
}


/*
 Function is used in order to accept an order by updating the status of the order
 */
export async function rejectOrderById(orderId){
    return new Promise((resolve, reject)=>{
        firebase.database().ref('Orders/' + orderId).update({
            status:"rejected"
        }, function(error) {
            if (error) {
                alert(error.message);
                reject(error);
            } else {
                // Data saved successfully!
                resolve();
            }
        });
    })
}

export async function retrieveAllOrders(){
    return new Promise((resolve, reject)=>{
        try{
            ordersPath.once('value',(dataSnap)=>{
                let orders = dataSnap.val();
                orders = transformOrdersArrayForRenderingPurposes(orders);
                console.log(orders);
                resolve(orders);
            })
        }
        catch (err){
            reject(err);
        }
    })
}



