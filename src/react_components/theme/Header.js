import React from 'react';
import AWBKundali from '../awbKundali/AWBKundali.js';
import MainStore from "../MainStore";
import {Observer} from 'mobx-react';

export default class Header extends React.Component {
	render() {
		return (
			<Observer>{() =>
				<header className="topbar" data-navbarbg="skin5">
					<nav className="navbar top-navbar navbar-expand-md navbar-dark fixed-top">
						<div className="navbar-header" data-logobg="skin5">
							<a className="nav-toggler waves-effect waves-light d-block d-md-none">
								<i className="ti-menu ti-close"></i>
							</a>
							<a className="navbar-brand bg-white" href="index">
								<span className="logo-text"><img className="light-logo w-100" src="assets/images/client_logistics_logo.jpg" alt="homepage" /></span>
							</a>
							<a className="topbartoggler d-block d-md-none waves-effect waves-light" href="#" onClick={e=> e.preventDefault()} data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
								<i className="ti-more"></i>
							</a>
						</div>
						<div className="navbar-collapse collapse" id="navbarSupportedContent" data-navbarbg="skin5">
							<ul className="navbar-nav float-left">
								<li className="nav-item d-none d-md-block"><a className="nav-link sidebartoggler waves-effect waves-light" href="#" onClick={e=> e.preventDefault()} data-sidebartype="mini-sidebar"><i className="mdi mdi-menu font-24"></i></a>
								</li>
							</ul>
							<AWBKundali MainStore={MainStore}/>
							<ul className="navbar-nav float-right">
								<li className="nav-item dropdown">
									<a className="nav-link dropdown-toggle text-muted waves-effect waves-dark pro-pic" href="" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
										<img className="rounded-circle" src="assets/images/users/1.jpg" alt="user" width="31" />
									</a>
									<div className="dropdown-menu dropdown-menu-right user-dd animated" onClick={this.props.MainStore.logout}><a className="dropdown-item" href="#"><i className="fa fa-power-off m-r-5 m-l-5"></i> Logout</a>
									</div>
								</li>
							</ul>
						</div>
					</nav>
				</header>
			}</Observer>
		);
	};
}
