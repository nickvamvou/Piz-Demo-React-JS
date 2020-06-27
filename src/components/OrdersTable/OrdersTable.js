/**
 * Created by nikolasvamvou on 6/20/20.
 */
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
import {listenToOrdersGeneratedToday, getOrderInformationById, acceptOrderById, rejectOrderById, retrieveAllOrders} from '../../api/api'
import OrderModal from '../SpecificOpenOrder/SpecificOrder'
import OpenOrdersTable from '../OpenOrdersTable/OpenOrdersTable'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
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

const fields = ['id','location', 'store', 'date','time', 'price', 'status']


class OrdersTable extends React.Component {



    componentDidMount = async ()=>{
        try {
            let orders = await retrieveAllOrders();
            console.log(orders)
            this.setState({orders : orders})
        }
        catch (e){
            alert("Αδυναμία εύρεσης παραγγελιών, προσπαθήστε αργότερα")
        }
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


    state = {
        orders: [],
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
                                Όλες Οι Παραγγελίες
                            </CCardHeader>
                            <CCardBody>
                                <CDataTable
                                    columnFilter={'external:true'}
                                    noItemsView={'noItems: false'}
                                    sorter={'external:true'}
                                    clickableRows = {true}
                                    onRowClick={(item)=>{
                                        this.onOpenOrderClick(item.id)
                                    }}
                                    items={this.state.orders}
                                    fields={fields}
                                    itemsPerPage={10}
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
                                adminView = {true}
                            /> :
                            <div></div>
                    }
                </div>
            );
        }
        else{
            return(
                <Redirect to={{pathname: '/login', state: { prevPath: "all-orders" }}}/>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTable)