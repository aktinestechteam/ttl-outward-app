import React from "react";
// import Table from 'react-bootstrap/Table'
import axios from 'axios';
import ShowError from "../shared/ShowError";
import custom from '../../config/custom.js';
import APIService from "../APIService";
export default class AWBQuery extends React.Component {

	
	constructor(props) {
		super(props);
		this.state = {
			awb_kundali_data: props.awb_kundali_data,
			existing_queries: [],
			query_text: "",
			create_query_flag : true,
			error_new_query: '',
			newQueryCommentText : '',
			newQueryText:'',
		}
	}


	componentDidMount() {
		this._getExistingAWBQueries();
	}

	_getExistingAWBQueries() {
		// let token=JwtToken.getPlainJwtToken();
		// axios.get(`${process.env.REACT_APP_API_BASE_PATH}/getAWBQueries`, {
		// 		params: {awb_no: this.props.awb_kundali_data.awb_no},
		// 		headers:{
		// 			'Authorization': `Bearer ${token}`
		// 		}
		// 	})
		APIService.get('/getAWBQueries', {awb_no: this.props.awb_kundali_data.awb_no},
		function (response) {
				console.log('succccsesQueries');
				console.log(JSON.stringify(response));
				if(response.errormsg) {
					console.log(response.errormsg);
				} else {
					this.setState({
						existing_queries: response.data
					});

					//	To update the count
					this.props.getAWBQueryCount();

					if(response.data.length > 0){
						for (let i = 0; i < response.data.length; i++){
							if (response.data[i].closed_on === 0){
								this.setState({
									create_query_flag: false
								});
							}
						}
					}
				}
			}.bind(this));
	}

	createAWBQuery = () => {

		let error_new_query = this.state.newQueryText ? (this.state.newQueryText.length < 10 ? 'Please enter the New Query text of minimum 10 letters' : '') : 'Please enter the New Query text !';
		this.setState({error_new_query: error_new_query});
		
		if(error_new_query)
			return;

		let data = new FormData()
		data.append('station', this.state.awb_kundali_data.station)
		data.append('awb_no', this.state.awb_kundali_data.awb_no)
		data.append('query_text', this.state.newQueryText)
		// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/createAWBQuery`, data, JwtToken.getJwtTokenHeader())
		APIService.post('/createAWBQuery', data,
		function(res) {
			console.log(res.result);

			if(res.data.error) {

			} else {
				this._getExistingAWBQueries();
			}
		}.bind(this));
	}

	_onClickAddComment = (is_closing_comment, query_id) => {
		let error_new_query_comment = this.state.newQueryCommentText ? (this.state.newQueryCommentText.length < 10 ? 'Please enter the New Query Comment text of minimum 10 letters' : '') : 'Please enter the New Query Comment text !';
		this.setState({error_new_query_comment: error_new_query_comment});
		
		if(error_new_query_comment)
			return;

		let data = new FormData()

		data.append('awb_query', query_id);//this.state.awb_kundali_data.
		data.append('awb_no', this.state.awb_kundali_data.awb_no);
		data.append('station', this.state.awb_kundali_data.station);
		data.append('comment_text', this.state.newQueryCommentText);
		data.append('close', is_closing_comment);

		// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/createAWBQueryComment`, data, JwtToken.getJwtTokenHeader())
		APIService.post('/createAWBQueryComment', data,
		function(res) {
			console.log(res.result);
			this.setState({newQueryCommentText:""})
			if(res.data.error) {
				
			} else {
				this._getExistingAWBQueries();
			}
		}.bind(this));
		this.setState({newQueryCommentText:""})
	}

	_onChangeNewQueryText = (event) => {

		this.setState({newQueryText:event.target.value})
		if(this.state.newQueryText.length > 10) {
			this.setState({error_new_query: ''});
		}
	}

	_onChangeNewQueryCommentText = (event) => {

		this.setState({newQueryCommentText:event.target.value})
		if(this.state.newQueryCommentText.length > 10) {
			this.setState({error_new_query_comment: ''});
		}
	}

	_getAccordianMain = () => {
		let existing_queries = this.state.existing_queries.sort(function(a,b){
			return b.createdAt - a.createdAt
		});
		let need_to_allow_create_new_query = true;

		for(let i = 0; i < existing_queries.length; i++) {
			if(existing_queries[i].closed_on === 0) {
				need_to_allow_create_new_query = false;
				break;
			}
		}

		return (
			<div className="accordion" id="accordionExample">
				{need_to_allow_create_new_query &&
					this._getViewToCreateNewQuery()
				}
				{					
						existing_queries.map((existing_query, i) => {
						return this._getSingleAccordianItem(existing_query)
					})
				}
			</div>
		);
	}

	_getViewToCreateNewQuery = () => {
		return (
			<div className="card p-2">
				<div className="row">
					<div className="col-md-12 text-center">
						<h4>Add New Query</h4>
					</div>
					<div className="col"></div>
					<div className="col-md-6">
						<textarea className="input-group" id="add_query" name="add_query" rows="3" onChange={this._onChangeNewQueryText}></textarea>
						{this.state.error_new_query &&
							<ShowError text={this.state.error_new_query} />
						}
					</div>
					<button className="btn btn-success" onClick={this.createAWBQuery}>Add New Query</button>
					<div className="col"></div>
				</div>
			</div>
		);
	}

	_getSingleAccordianItem = (existing_query) => {
		let existing_queries = existing_query.comments.sort(function(a,b){
			return b.createdAt - a.createdAt
		});
		
		return (
			<div className="card m-b-0 border border-bottom border-white">
				{/*	Header */ 
					this._getAccordianHeader(existing_query)
				}
				<div className="bg-secondary collapse" id={"collapse_" + existing_query.id} aria-labelledby={"heading_" + existing_query.id} data-parent="#accordionExample">
					<div className="timeline">
						<div className="timeline__wrap">
							<div className="timeline__items pr-5">
								{
									console.log("shree",JSON.stringify(existing_query.comments))
									
								}
								{/*	add comment*/(existing_query.closed_on === 0) &&
									this._getViewToCreateNewComment(existing_query)
								}
								{
										existing_queries.map((comment, index) => {
										return this._getViewForEachComment(comment);
									})
								}
								
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_getAccordianHeader = (existing_query) => {
		let is_open_query = (existing_query.closed_on === 0);
		return (
			<div className="card-header bg-dark text-white" id={"heading_" + existing_query.id}>
				<div className="mb-0">
					<a className="row collapsed" data-toggle="collapse" data-target={"#collapse_" + existing_query.id} aria-expanded={'' + is_open_query} aria-controls={"collapse_" + existing_query.id}>
						<div className="col-md-1">
							<h1><i className={"m-r-5 fa fa-check-circle pr-3 " + (is_open_query ? 'text-success' : 'text-secondary')} aria-hidden="true"></i></h1>
						</div>
						<div className="col-md-2">
							<div className="badge badge-info">{window.moment(existing_query.createdAt).format(custom.custom.human_readable_date_time_format)}</div>
							<br/>
							<div className="badge badge-warning">{existing_query.raised_by}</div>
						</div>
						<div className="col-md-9">
							<div>
								<div className={"mr-3 badge " + (is_open_query ? "badge-success" : "badge-secondary")}>{is_open_query ? 'OPEN' : 'CLOSED'}</div><small className="text-warning">{existing_query.query_no}</small>
							</div><span>{existing_query.query_text}</span>
						</div>
					</a>
				</div>
			</div>
		);
	}

	_getViewToCreateNewComment = (existing_query) => {
		return (
			<div className="timeline__item timeline__item--right animated fadeIn" side="right">
				<div className="timeline__content p-0">
					<div className="card-body">
						<div className="row">
							<div className="col-md-12 text-center">
								<h4>Add New Comment</h4>
								<small className='text-info'>Please click "Add New Comment" to save the comment and to keep the query in open state.</small>
							</div>
							<div className="col"></div>
							<button className="btn btn-danger my-1" onClick={() => this._onClickAddComment(true, existing_query.id)}>CLOSE THIS QUERY</button>
							<div className="col-md-6">
								<textarea className="input-group" id="add_comment" name="add_comment" rows="3" value={this.state.newQueryCommentText} onChange={this._onChangeNewQueryCommentText}></textarea>
								{this.state.error_new_query_comment &&
									<ShowError text={this.state.error_new_query_comment} />
								}
							</div>
							<button className="btn btn-success my-1" onClick={() => this._onClickAddComment(false, existing_query.id)}>Add New Comment</button>
							<div className="col"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_getViewForEachComment = (comment) => {
		return (
			<div className="timeline__item timeline__item--right animated fadeIn" side="right">
				<div className="timeline__content p-0">
					<div className="card-body row">
						<div className="col-md-2">
							<div><small className="font-weight-bold">{window.moment(comment.createdAt).format(custom.custom.human_readable_date_time_format)}</small>
							</div>
							<div>
								<div className="badge badge-secondary">{comment.comment_by}</div>
							</div>
							
						</div>
						<div className="col-md-10">{comment.comment_text}</div>
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<>
				{
					this._getAccordianMain()
				}
			</>
		);
	}
}