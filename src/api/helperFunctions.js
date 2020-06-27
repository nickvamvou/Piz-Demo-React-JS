/**
 * Created by nikolasvamvou on 6/17/20.
 */
export function isNewOrder(order){
    return order.status !== undefined && order.status === 'open'
}

export function orderIsGeneratedToday(){
    /*
    Start of day time in millisecond in local time
     */
    let currentDate = new Date();
    return new Date(currentDate.toLocaleDateString()).valueOf();
}

export function getOrderDate(milisecond){
    let date = new Date(milisecond);
    return date.toLocaleDateString()
}

export function getOrderTime(milisecond){
    let date = new Date(milisecond);
    return date.toLocaleTimeString()
}


export function transformOrdersArrayForRenderingPurposes(orders){
    /*
    Get all keys from object orders returned from firebase and pass them in a new array
     */
    let ordersArray = Object.keys(orders).map((key)=>{
        let order = orders[key];
        order.id = Number(key);
        let timeInMil = order.time;
        order.time = getOrderTime(timeInMil);
        order.date = getOrderDate(timeInMil);
        order.price = order.totalPrice;
        order.location = order.restaurantLocation;
        return orders[key];
    })

    return ordersArray;

}