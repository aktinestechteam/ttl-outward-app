import { Observer } from 'mobx-react';
import React from 'react';
import { NavLink} from 'react-router-dom';
import { custom } from '../../config/custom';
// import MainStore from '../MainStore';

let menu_options = [
	{id: "menu_dashboard", name: 'Dashboard', path: '/', icon: 'mdi mdi-chart-bar',},
	{id: "menu_planner", name: 'Planner', path: '/planner', icon: 'mdi mdi-clock-fast', },
	{id: "menu_operations", name: 'Operations', path: '/operations', icon: 'fas fa-tasks' },
	{id: "menu_query_and_claims", name: 'Query & Claims', path: '/queryandclaims', icon: 'fas fa-comments'},
	{id: 'menu_airportlist', name: 'Stations', path: '/stations', icon: 'mdi mdi-airplane', },
	{id: "menu_flights", name: 'Flights', path: '/flights', icon: 'mdi mdi-airplane-takeoff'},
	{id: "menu_shccodes", name: 'SHC', path: '/shc', icon: 'fas fa-tags', },
	{id: "menu_reasons", name: 'Reasons', path: '/reasons', icon: 'mdi mdi-comment-multiple-outline', },
	{id: "menu_agents", name: 'Agents', path: '/agents', icon: 'fas fa-user-plus', },
	{id: "menu_settings", name: 'Settings', path: '/settings', icon: 'fas fa-wrench'},
];

export default class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	};

	SidebarItem = (id, href, list_of_mdis, label) => {
		return (
			<Observer>{() => {
				switch(href) {
					case '/planner': {
						if(this.props.MainStore.departments.indexOf(custom.department_name.planner_ops) === -1)
						return (<></>);
					}
					default: {
						return(
							<NavLink className="sidebar-item"  id={id} to={href} exact={false} aria-expanded="false" activeClassName="selected" exact={true} >
								<div className="sidebar-link waves-effect waves-dark" >
									<i className={list_of_mdis}></i>
									<span className="hide-menu">{label}</span>
								</div>
							</NavLink>
						);
					}
					break;
				}
				
			}}</Observer>
		);
	}

	render() {
		return (
			<aside className="left-sidebar position-fixed" data-sidebarbg="skin5">
				<div className="scroll-sidebar">
					<nav className="sidebar-nav">
						<ul className="" id="sidebarnav">
							{
								menu_options.map((label, i) => this.SidebarItem(menu_options[i].id, menu_options[i].path, menu_options[i].icon, menu_options[i].name))
							}
							
						</ul>
					</nav>
				</div>
			</aside>
		)
	};
}
