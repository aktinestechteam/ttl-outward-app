import React, { Component } from 'react'
import {Observer} from 'mobx-react';

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: ""
		}
	}

	eventKeyListner = (event) => {
		if(event.key == "Enter") {
			this.props.MainStore.login(this.state.username, this.state.password);
		}
	}

	performLogin = (event) => {
		this.props.MainStore.login(this.state.username, this.state.password);
	}
		
	render() {
		return (
			<Observer>{() => 
				<div>
					{/* 
					<div className="row bg-white"><img className="p-4" src="/images/client_logistics_logo.jpg" alt="logo" /></div>
					*/}
					<div className="row bg-white">
						<img className="p-4" src="assets/images/client_logistics_logo.jpg" alt="logo" />
					</div>
					<div className="auth-wrapper d-flex no-block justify-content-center align-items-center bg-dark">
						<div className="auth-box border-top border-secondary">
							<div id="loginform">
								<div className="row p-t-3">
									<span className="db col-4"><img src="assets/images/client_logo.png" alt="logo" /></span>
									<div className="col-8">
										<h4>Outward Cargo Process Automation</h4>
										<p>OCPA (version 0.1)</p>
										<p>Launch Pad</p>
										<i><b>Enter your user information and click 'Login'. </b>In case you are unsure of your account information, contact your system administrator.</i>
									</div>
								</div>
								{/* Form*/}
								<div className="form-horizontal m-t-20">
									<input type="hidden" name="_csrf" />
									<div className="row p-b-30">
										<div className="col-12">
											<div className="input-group mb-3">
												<div className="input-group-prepend"><span className="input-group-text bg-success text-white" id="basic-addon1"><i className="ti-user" /></span></div>
												<input className="form-control form-control-lg" type="text" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" name="username" value={this.state.username} autoComplete="off" required style={{backgroundColor: 'palegoldenrod'}} onChange={(event) => this.setState({username: event.target.value})} onKeyDown={this.eventKeyListner}/>
											</div>
											<div className="input-group mb-3">
												<div className="input-group-prepend"><span className="input-group-text bg-warning text-white" id="basic-addon2"><i className="ti-pencil" /></span>
												</div>
												<input className="form-control form-control-lg" type="password" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" name="password" value={this.state.password} autoComplete="off" required style={{backgroundColor: 'palegoldenrod'}} onChange={(event) => this.setState({password: event.target.value})} onKeyDown={this.eventKeyListner}/>
											</div>
										</div>
									</div>
									<div className="row border-top border-secondary">
										<div className="col-12">
											<div className="form-group">
												<div className="p-t-20">
													{/*button#to-recover.btn.btn-info(type='button')i.fa.fa-lock.m-r-5|Lost password?*/}
													<button className="btn btn-success float-right" type="submit" onClick={this.performLogin}>Login</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			}</Observer>
		);
	}
}

export default Login;
