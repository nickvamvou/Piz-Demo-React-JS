import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import firebase from '../../api/DatabaseConf'
import store from '../../redux/Store/StoreConf'

const Login = ({ history }) => {
    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {
                await firebase
                    .auth()
                    .signInWithEmailAndPassword(email.value, password.value);
                store.dispatch({type: 'LOG_USER'})
                // window.location.replace("http://localhost:3002/login");
                history.push('/'+history.location.state.prevPath);
            } catch (error) {
                alert(error);
            }
        },
        [history]
    );


    return (
        <div>
            <h1>Log in</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Email
                    <input name="email" type="email" placeholder="Email" />
                </label>
                <label>
                    Password
                    <input name="password" type="password" placeholder="Password" />
                </label>
                <button type="submit">Log in</button>
            </form>
        </div>
    );
};

export default withRouter(Login);