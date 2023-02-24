import React, { Component } from 'react'
import Matrix_Layout from './theme/Matrix_Layout';
// import SignIn from './auth/SignIn';
import Login from './login/Login';

class OutwardAutomationRoot extends Component {

	constructor(props) {
		super(props);
		this.state={
			show_login: false,
		}	
	}
	

	is_logged_in = () => {
		this.setState({show_login: false});
	}

	is_logged_out = () => {
		this.setState({show_login: true});
	}

	render() {
		if(this.state.show_login) {
			return(
				<Login />
				// <SignIn is_logged_in = {this.is_logged_in}/>
			);
		} else {
			return(
				<Matrix_Layout />
			);
		}
	}
}


export default OutwardAutomationRoot;