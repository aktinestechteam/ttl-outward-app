import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_PATH } from './../../env';

export default function SignIn(props) {

    const [state, setState] = useState({
        username: "admin",
        password: "admin"
    })
    
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if(state.username.length && state.password.length) {
            sendDetailsToServer()    
        } else {
            props.showError('Invalid Credentials');
        }
    }

    const sendDetailsToServer = () => {
        console.log("Inside sendDetailsToServer()");
        if(state.username.length && state.password.length) {
            const payload={
                "username":state.username,
                "password":state.password,
            }
            console.log(API_BASE_PATH)
            axios.post(API_BASE_PATH + '/login', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Registration successful. Redirecting to home page..'
                        }))
                        // redirectToHome();
                        props.is_logged_in();
                        props.showError(null);
                    } else{
                        console.log("Some error occured")
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });    
        } else {
            console.log('Please enter valid username and password')    
        }
        
    }


    return (
        <div>
            <div className="auth-wrapper d-flex no-block justify-content-center align-items-center bg-dark">
                <div className="auth-box border-top border-secondary">
                    <div id="loginform">
                        <div className="row p-t-3"><span className="db col-4"><img src="assets/images/client_logo.png" alt="logo" /></span>
                            <div className="col-8">
                                <h4>Outward Cargo Process Automation</h4>
                                <p>OCPA (version 0.1)</p>
                                <p>Launch Pad</p><i><b>Enter your user information and click 'Login'. </b>In case you are unsure of your account information, contact your system administrator.</i></div>
                        </div>
                        <form className="m-t-20">
                            <div className="form-group text-left">
                                <label htmlFor="Username">Username</label>
                                <input type="username"
                                    className="form-control"
                                    id="username"
                                    placeholder="Enter username"
                                    value={state.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group text-left">
                                <label htmlFor="Password">Password</label>
                                <input type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    value={state.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={handleSubmitClick}
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}