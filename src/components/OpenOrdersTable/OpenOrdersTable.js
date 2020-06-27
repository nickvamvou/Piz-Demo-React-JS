/**
 * Created by nikolasvamvou on 6/17/20.
 */
import React from 'react';
import {
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow
} from '@coreui/react'
import {connect} from 'react-redux'
import {listenToOrdersGeneratedToday, getOrderInformationById, acceptOrderById, rejectOrderById, retrieveAllOrders, removeListener} from '../../api/api'
import OrderModal from '../SpecificOpenOrder/SpecificOrder'
import { useHistory } from "react-router-dom";
import {
    Redirect
} from "react-router-dom";


const getBadge = status => {
    console.log(status)
    switch (status) {
        case 'open': return 'warning'
        case 'rejected': return 'danger'
        case 'accepted': return 'success'
        default: return 'primary'
    }
}

const fields = ['store', 'date','time', 'price', 'status']


class OrdersTable extends React.Component {

    componentDidMount = async ()=>{
        try {
            // if(this.props.restaurantLocation === ''){
            //     this.props.history.push('/location');
            // }
            // //remove all previous listeners for daily orders
            // removeListener();
            //remove any orders from the state

            this.props.clearOrders();

            await listenToOrdersGeneratedToday(this.extractRestaurantLocationFromUrl(window.location.href), true);
        }
        catch (e){
            alert(e.message)
            alert("Αδυναμία εύρεσης παραγγελιών, προσπαθήστε αργότερα")
        }
    }

    extractRestaurantLocationFromUrl = (url)=>{
        let arrSplit = url.split("/");
        return arrSplit[arrSplit.length-1];

    }

    /*
     When the user click on an open order a modal showing the specific information for the order
     must be launched
     */
    onOpenOrderClick = async (itemId)=>{
        //get order information
        let order = await getOrderInformationById(itemId);

        this.setState({showModal : true, orderId: order.id, items : order.basketItems, totalPrice:order.totalPrice, location : order.location,
            deliveryNotes:order.deliveryNotes, lat : order.lat, lon : order.lon, status : order.status, deliveryTimeOrder : order.deliveryTime,
        storeType : order.store})
    }

    closeModal = ()=>{
        this.setState({showModal : false})
    }

    /*
    Called by child modal in order to accept the order
     */
    acceptOrder = async (orderId, deliveryTime)=>{
        try{
            await acceptOrderById(orderId, deliveryTime);
            this.updateOrderStatusRedux(orderId, "accepted");
            this.setState({showModal : false})
        }
        catch (e){
            alert("Η παραγγελία δεν μπορεί να γίνει αποδεκτή αυτή την στιγμή.")
        }

    }

    rejectOrder = async (orderId)=>{
        try{
            await rejectOrderById(orderId);
            this.updateOrderStatusRedux(orderId, "rejected");
            this.setState({showModal : false})
        }
        catch (e){
            alert("Η παραγγελία δεν μπορεί να ακυρωθεί αυτή την στιγμή.")
        }
    }

    updateOrderStatusRedux = (orderId, status)=>{
        this.props.updateOrderStatus(orderId, status);
    }

    componentWillUnmount = async ()=>{
        //Disconect listeners
        try{
            await listenToOrdersGeneratedToday(this.extractRestaurantLocationFromUrl(window.location.href), false);
        }
        catch (e){
            alert("Πρακαλώ επικοινωνήστε με τον admin.")
        }

    }


    state = {
        showModal : false,
        orderId : 0,
        items : [],
        totalPrice : 0,
        location : '',
        deliveryNotes:'',
        lat : 0,
        lon : 0,
        status : '',
        deliveryTimeOrder : 0,
        storeType : ''
    }

    renderAppropriateScreen = ()=>{

        if(this.props.userLoggedIn){
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height:"100vh",
                    width : "100vw",

                }}>

                    <CCol xs="12" lg="12">
                        <CCard>
                            <CCardHeader>
                                Παραγγελίες Ημέρας {this.props.restaurantLocation}
                            </CCardHeader>
                            <CCardBody>
                                <CDataTable
                                    noItemsView={'noItems: false'}
                                    clickableRows = {true}
                                    onRowClick={(item)=>{
                                        this.onOpenOrderClick(item.id)
                                    }}
                                    items={this.props.currentDayOrders}
                                    fields={fields}
                                    itemsPerPage={20}
                                    pagination
                                    scopedSlots = {{
                                        'status':
                                            (item)=>(
                                                <td>
                                                    <CBadge color={getBadge(item.status)}>
                                                        {item.status}
                                                    </CBadge>
                                                </td>
                                            )
                                    }}
                                />
                            </CCardBody>
                        </CCard>
                    </CCol>
                    {
                        this.state.showModal ?
                            <OrderModal
                                status = {this.state.status}
                                orderId = {this.state.orderId}
                                items = {this.state.items}
                                totalPrice = {this.state.totalPrice}
                                deliveryNotes = {this.state.deliveryNotes}
                                location = {this.state.location}
                                lat = {this.state.lat}
                                lon = {this.state.lon}
                                deliveryTimeOrder = {this.state.deliveryTimeOrder}
                                storeType   = {this.state.storeType}
                                closeModal = {this.closeModal}
                                acceptOrder = {this.acceptOrder}
                                rejectOrder = {this.rejectOrder}
                                adminView = {false}
                            /> :
                            <div></div>
                    }

                </div>
            );
        }
        else{
            return(
                <Redirect to={{pathname: '/login', state: { prevPath: this.extractRestaurantLocationFromUrl(window.location.href)}}}/>
            )
        }
    }

    render() {
        return (
            this.renderAppropriateScreen()
        );
    }
}

//used for pushing state to props of the component in order to show items
const mapStateToProps = (state)=>{
    return {
        userLoggedIn : state.userLoggedIn,
        currentDayOrders : state.currentDayOrders,
        restaurantLocation : state.restaurantLocation
    }
}

//removing a product from the cart, calling the reducer
const mapDispatchToProps = (dispatch) => {
    return {
        updateOrderStatus: (orderId, status) => dispatch({ type: 'UPDATE_ORDER_STATUS', orderId : orderId, status : status}),
        clearOrders : ()=>dispatch({type : 'CLEAR_ORDERS'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTable)