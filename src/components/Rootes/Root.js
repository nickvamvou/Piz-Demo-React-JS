/**
 * Created by nikolasvamvou on 6/20/20.
 */
import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import OpenOrdersTable from '../OpenOrdersTable/OpenOrdersTable'
import Orders from '../OrdersTable/OrdersTable'
import Location from '../Location/Location'
import Login from '../Auth/login'
import {} from 'react-bootstrap';

const routes = [
    {
      path : "/login",
      component : Login,
    },
    {
        path: "/Mikonos",
        component:OpenOrdersTable
    },
    {
        path: "/Kifisia",
        component:OpenOrdersTable
    },
    {
        path: "/all-orders",
        component:Orders
    },
    {
        path : "/location",
        component : Location
    }
];


export default function RouteConfigExample() {
    return (
        <Router>
            <div>



                <Switch>
                    {routes.map((route, i) => (
                        <RouteWithSubRoutes key={i} {...route} />
                    ))}
                </Switch>
            </div>
        </Router>
    );
}

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route) {
    return (
        <Route
            path={route.path}
            render={props => (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={route.routes} />
            )}
        />
    );
}




