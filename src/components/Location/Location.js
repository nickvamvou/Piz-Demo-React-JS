/**
 * Created by nikolasvamvou on 6/20/20.
 */
import React from 'react';
import {Card, Button} from 'react-bootstrap';
import {connect} from 'react-redux'


class Location extends React.Component {

    pressedOnRestaurantLocation = (restaurantLocation)=>{
        this.props.updateRestaurantLocation(restaurantLocation);
        //move to the daily orders
        this.props.history.push('/daily-orders');
    }

    render(){
        return(

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height:"100vh"

            }}>

                    <Card  style={{ width: '18rem', marginRight : 50 }}>
                        <Card.Img variant="top" src={require("../../assets/mykonos.jpg")} />
                        <Card.Body>
                            <Card.Title>Mykonos</Card.Title>
                            <Button onClick={()=>this.pressedOnRestaurantLocation('Mikonos')} variant={this.props.restaurantLocation === 'Mikonos' ? "primary" : 'light'}>Select Mykonos</Button>
                        </Card.Body>
                    </Card>



                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={require("../../assets/kifisia.jpg")} />
                        <Card.Body>
                            <Card.Title>Kifisia</Card.Title>
                            <Button onClick={()=>this.pressedOnRestaurantLocation('Kifisia')} variant={this.props.restaurantLocation === 'Kifisia' ? "primary" : 'light'}>Select Kifisia</Button>
                        </Card.Body>
                    </Card>
                </div>

        )
    }

}

//used for pushing state to props of the component in order to show items
const mapStateToProps = (state)=>{
    return {
        restaurantLocation : state.restaurantLocation
    }
}

//removing a product from the cart, calling the reducer
const mapDispatchToProps = (dispatch) => {
    return {
        updateRestaurantLocation: (location) => dispatch({ type: 'UPDATE_RESTAURANT_LOCATION', restaurantLocation : location}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Location)