/**
 * Created by nikolasvamvou on 6/17/20.
 */
/*
 This component can be placed on top of the open orders and represents the information for a specific
 order
 */
import React, {useState, useEffect, useCallback} from 'react';
import {
    CDataTable,
    CBadge
} from '@coreui/react'
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import usersData from '../users/UsersData'


function OrderModal({status, orderId, items, totalPrice, deliveryNotes, location, lat, lon, deliveryTimeOrder, storeType, closeModal, acceptOrder, rejectOrder, adminView}) {

    const [show, setShow] = useState(true);
    const [deliveryTime, setTime] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleTime = (time)=>setTime(time);


    /*
     When order is rejected
     */
    const onRejectOrder = useCallback(()=>{
        rejectOrder(orderId);
    })

    /*
     When order is accepted
     */
    const onAcceptOrder = useCallback(()=>{

        if(deliveryTime!==null){
            acceptOrder(orderId, deliveryTime);
        }
        else{
            alert("Παρακλώ επιλέξτε χρόνο παράδοσης για την παραγγελία πριν την αποδεχτείτε");
        }

    },[deliveryTime])


    const DeliveryTimeOptionsBasedOnStoreType = {
        RISTORANTE : <div><h4>Ώρα μέχρι παράδοση [λεπτά]</h4>
            <Button variant="primary" onClick={()=>handleTime(15)}> 15 </Button>
            <Button variant="primary"> 20 </Button></div>,
        CAFFE : <div></div>,
        CANTINETTA : <div></div>
    }

    /*
     Modal actions based on the status of the order
     */
    const ACTIONS = {
        open :
            <div class = "mr-50">
                <Button variant="danger" onClick={onRejectOrder}> Απόρριψη Παραγγελίας </Button> {' '}
                <Button variant="success" onClick={onAcceptOrder}>Αποδοχή - Εκτύπωση Παραγγελίας </Button>
            </div>
        ,

        accepted : <div><Button variant="success" onClick={onAcceptOrder}>Επανεκτύπωση Παραγγελίας</Button></div>,
        rejected : <div></div>
    }

    const fields = ['name','price', 'quantity']

    return (
        <>
        <Modal
            show={true}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{'ID Παραγγελίας ' + orderId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Πιάτα</h4>
                <CDataTable
                    items={items}
                    fields={fields}
                    itemsPerPage={10}
                    pagination
                />

                <h4>Συνολική τιμή</h4>
                <p>{totalPrice + '€'}</p>

                {
                    deliveryNotes !== '' ?
                        <div>
                            <h4>Σημειώσεις Παραγγελίας : </h4>
                            <p>{deliveryNotes}</p>
                        </div> :
                        <div></div>
                }

                <h4>Διεύθυνση Παραγγελίας</h4>
                <p>{location}</p>
                <h4>Συντεταγμένες Παραγγελίας</h4>
                <p>{lat}</p>
                <p>{lon}</p>

                {
                    status === 'open' ?

                        {
                            RISTORANTE : <div>
                                <h4>Ώρα μέχρι παράδοση [λεπτά]</h4>
                                <Button size = 'lg' variant="primary" onClick={()=>handleTime(15)}> 15 </Button> {' '}
                                <Button size = 'lg' variant="primary" onClick={()=>handleTime(20)}> 20 </Button>
                            </div>,
                            CAFFE : <div></div>,
                            CANTINETTA : <div></div>
                        }[storeType]

                        :
                        <div>
                            <h4>Ώρα μέχρι παράδοση [λεπτά]</h4>
                            <p>{deliveryTimeOrder}</p>
                        </div>
                }

            </Modal.Body>
            <Modal.Footer>
                {
                    !adminView ?

                    {
                        open :
                            <div class = "mr-50">
                                <Button variant="danger" onClick={onRejectOrder}> Απόρριψη Παραγγελίας </Button> {' '}
                                <Button variant="success" onClick={onAcceptOrder}>Αποδοχή - Εκτύπωση Παραγγελίας </Button>
                            </div>
                        ,

                        accepted : <div><Button variant="success" onClick={onAcceptOrder}>Επανεκτύπωση Παραγγελίας</Button></div>,
                        rejected : <div></div>
                }[status] :
                        <div></div>
                }

            </Modal.Footer>
        </Modal>
        </>
    );
}

export default OrderModal
