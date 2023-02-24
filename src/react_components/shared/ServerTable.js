import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './styles.css';
import APIService from '../APIService';

class ServerTable extends Component {
	constructor(props) {
		super(props);

		if (this.props.columns === undefined || this.props.url === undefined) {
			throw "The prop 'columns' and 'url' is required.";
		}
		let default_texts = Object.assign(ServerTable.defaultProps.options.texts, {});
		let default_icons = Object.assign(ServerTable.defaultProps.options.icons, {});

		this.state = {
			saveBtn: false,
			add_new_button_title: props.add_new_button_title,
			table_title: props.title,
			options: Object.assign(ServerTable.defaultProps.options, this.props.options),
			requestData: {
				query: '',
				limit: 10,
				page: 1,
				orderBy: '',
				ascending: 0,
				where : this.props.season ?  this.props.season : '',
			},
			data: [],
			isLoading: true,
			upperPageBound: 5,
			lowerPageBound: 0,
			isPrevBtnActive: 'disabled',
			isNextBtnActive: '',
			pageBound: 5
		};
		this.state.requestData.limit = this.state.options.perPage;
		this.state.options.texts = Object.assign(default_texts, this.props.options.texts);
		this.state.options.icons = Object.assign(default_icons, this.props.options.icons);

		this.handleFetchData();

		this.handlePerPageChange = this.handlePerPageChange.bind(this);
		this.table_search_input = React.createRef();

		this.handleClick = this.handleClick.bind(this);
		this.btnDecrementClick = this.btnDecrementClick.bind(this);
		this.btnIncrementClick = this.btnIncrementClick.bind(this);
		this.btnNextClick = this.btnNextClick.bind(this);
		this.btnPrevClick = this.btnPrevClick.bind(this);
		// this.componentDidMount = this.componentDidMount.bind(this);
		this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
	}
///////////////////////////////////////pagination block////////////////
	componentDidUpdate() {
		window.$("ul li.active").removeClass('active');
		window.$('ul li#'+this.state.options.currentPage).addClass('active');
	}
	handleClick(event) {
		let options = this.state.options;
		let listid = Number(event.target.id);
		options.currentPage= listid;
		window.$("ul li.active").removeClass('active');
		window.$('ul li#'+listid).addClass('active');
		this.setPrevAndNextBtnClass(listid);
		this.handlePageChange(listid);
		this.setState({options});
	}
	setPrevAndNextBtnClass(listid) {
		console.log('setPrevAndNextBtnClass listid = ' + listid);
		let totalPage = Math.ceil(this.state.options.total / this.state.options.perPage);
		this.setState({isNextBtnActive: 'disabled'});
		this.setState({isPrevBtnActive: 'disabled'});
		if(totalPage === listid && totalPage > 1){
			this.setState({isPrevBtnActive: ''});
		}
		else if(listid === 1 && totalPage > 1){
			this.setState({isNextBtnActive: ''});
		}
		else if(totalPage > 1){
			this.setState({isNextBtnActive: ''});
			this.setState({isPrevBtnActive: ''});
		}
	}
	btnIncrementClick() {
		let options = this.state.options;
		this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
		this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
		let listid = this.state.upperPageBound + 1;
		options.currentPage = listid;
		this.setPrevAndNextBtnClass(listid);
		this.handlePageChange(listid);
		this.setState({options});
	}
	btnDecrementClick() {
		let options = this.state.options;
		this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
		this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
		let listid = this.state.upperPageBound - this.state.pageBound;
		options.currentPage = listid;
		this.setPrevAndNextBtnClass(listid);
		this.handlePageChange(listid);
		this.setState({options});
	}
	btnPrevClick() {
		let options = this.state.options;
		if((options.currentPage -1)%this.state.pageBound === 0 ){
			this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
			this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
		}
		let listid = options.currentPage - 1;
		options.currentPage = listid;
		this.setPrevAndNextBtnClass(listid);
		this.handlePageChange(listid);
		this.setState({options});
	}
	btnNextClick() {
		let options = this.state.options;
		if((options.currentPage +1) > this.state.upperPageBound ){
			this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
			this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
		}
		let listid = options.currentPage + 1;
		options.currentPage = listid;
		this.setPrevAndNextBtnClass(listid);
		this.handlePageChange(listid);
		this.setState({options});
	}

	/////////////////////////////////////////////////////////

	getPagingRange = (current, min, total, length) => {
		if (length > total) length = total;
	  
		let start = current - Math.floor(length / 2);
		start = Math.max(start, min);
		start = Math.min(start, min + total - length);
	   
		return Array.from({length: length}, (el, i) => start + i);
	}
	  

	renderPagination() {
		const options = this.state.options;
		console.log('pagination === > ' +JSON.stringify(options))
		let renderPageNumbers = [];
		let pagingRange = this.getPagingRange(options.currentPage, 1, options.lastPage, this.state.pageBound);
		console.log('pagin range - ' + pagingRange);
		for (let i = 1; i <= options.lastPage; i++) {
			renderPageNumbers.push(pagingRange.indexOf(i) == -1 ? undefined : (<li key={i} id={i}><a id={i} onClick={this.handleClick}>{i}</a></li>));
		}

		/*const renderPageNumbers = pageNumbers.map(number => {
			return(
				<li key={number} id={number}><a id={number} onClick={this.handleClick}>{number}</a></li>
			);
			if(number === 1 && options.currentPage === 1){
				return(
					<li key={number} className='active' id={number}><a id={number} onClick={this.handleClick}>{number}</a></li>
				)
			}
			else if((number < this.state.upperPageBound + 1) && number > this.state.lowerPageBound){
				return(
					<li key={number} id={number}><a id={number} onClick={this.handleClick}>{number}</a></li>
				)
			} else {
				console.log(number)
			}
		});*/
		console.log('lowerPageBound = ' + this.state.lowerPageBound);
		let pageIncrementBtn = null;
		//if(renderPageNumbers.length > this.state.upperPageBound){
		if(pagingRange[pagingRange.length - 1] < options.lastPage) {
			pageIncrementBtn = <li className=''><a onClick={this.btnIncrementClick}> &hellip; </a></li>
		}
		let pageDecrementBtn = null;
		//if(this.state.lowerPageBound >= 1){
		if(pagingRange[0] > 1) {
			pageDecrementBtn = <li className=''><a onClick={this.btnDecrementClick}> &hellip; </a></li>
		}
		let renderPrevBtn = null;
		if(this.state.isPrevBtnActive === 'disabled') {
			renderPrevBtn = <li className={this.state.isPrevBtnActive}><span id="btnPrev"> Prev </span></li>
		}
		else{
			renderPrevBtn = <li className={this.state.isPrevBtnActive}><a id="btnPrev" onClick={this.btnPrevClick}> Prev </a></li>
		}
		let renderNextBtn = null;
		if(this.state.isNextBtnActive === 'disabled') {
			renderNextBtn = <li className={this.state.isNextBtnActive}><span id="btnNext"> Next </span></li>
		}
		else{
			renderNextBtn = <li className={this.state.isNextBtnActive}><a id="btnNext" onClick={this.btnNextClick}> Next </a></li>
		}
		return (
			<div>
			<ul className="pagination">
				{renderPrevBtn}
				{pageDecrementBtn}
				{renderPageNumbers}
				{pageIncrementBtn}
				{renderNextBtn}
			</ul>
			</div>
		);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.url !== this.props.url) {
			this.setState({isLoading: true}, () => {
				this.handleFetchData();
			});
		}
		return true;
	}

	tableClass() {
		let classes = 'table ';
		// this.props.hover ? classes += 'table-hover ' : '';
		// this.props.bordered ? classes += 'table-bordered ' : '';
		// this.props.condensed ? classes += 'table-condensed ' : '';
		// this.props.striped ? classes += 'table-striped ' : '';

		return classes;
	}

	renderColumns() {
		const columns = this.props.columns.slice();
		const headings = this.state.options.headings;
		const options = this.state.options;
		const columns_width = this.state.options.columnsWidth;

		return columns.map((column) => (
			<th key={column}
				className={'table-' + column + '-th ' + (options.sortable.includes(column) ? ' table-sort-th ' : '') +
				(options.columnsAlign.hasOwnProperty(column) ? ' text-' + options.columnsAlign[column] : '')}
				style={{
					maxWidth: columns_width.hasOwnProperty(column) ?
						Number.isInteger(columns_width[column]) ?
							columns_width[column] + '%' :
							columns_width[column] : ''
				}}
				onClick={() => this.handleSortColumnClick(column)}>
				<span>{headings.hasOwnProperty(column) ? headings[column] : column.replace(/^\w/, c => c.toUpperCase())}</span>
				{
					options.sortable.includes(column) && <span
						className={'table-sort-icon pull-right ' + (this.state.requestData.orderBy !== column ? options.icons.sortBase : (this.state.requestData.ascending === 1 ? options.icons.sortUp : options.icons.sortDown))}/>
				}
			</th>
		));
	}

	renderData() {
		if (!this.props.refresh) {
			this.setState({isLoading: true}, () => {
				this.handleFetchData();
			});
		} else {
			const data = this.state.data.slice();
			const columns = this.props.columns.slice();
			const has_children = this.props.children !== undefined;
			let self = this;

			return data.map(function (row, row_index) {
				row.index = row_index;
				return (
					<tr key={row_index}>
						{
							columns.map((column, index) => (
								<td key={column + index} className={'table-' + column + '-td'}>
									{has_children ?
										self.props.children(row, column) :
										row[column]}
								</td>
							))
						}
					</tr>
				)
			});
		}
	}

	handleSortColumnClick(column) {
		if (this.state.options.sortable.includes(column)) {
			const request_data = this.state.requestData;

			if (request_data.orderBy === column) {
				request_data.ascending = request_data.ascending === 1 ? 0 : 1;
			} else {
				request_data.orderBy = column;
				request_data.ascending = 1;
			}

			this.setState({requestData: request_data, isLoading: true}, () => {
				this.handleFetchData();
			});
		}
	}

	componentWillReceiveProps(newProps) {
		console.log('------------new props-----'+JSON.stringify(newProps));
		var stateCopy = Object.assign({}, this.state.requestData)
				stateCopy.where=newProps.season;
				this.setState({requestData : stateCopy})
		this.handleFetchData(newProps.season)
		if (newProps.saveBtnClicked == true){
		// this.setState({ saveBtn: true },() =>{
			// console.log('component received new props true call for handleFetchData data');
			this.handleFetchData();
		// });
		} else {
			// this.setState({ saveBtn: false },() =>{
				console.log('component received new props==== false ==call for handleFetchData data');
				// this.handleFetchData();
			// });
		}
	}

	loadingData() {
		console.log('loading data is called');
		this.setState({isLoading: true}, () => {
			this.handleFetchData();
		});
	}

	async handleFetchData(season) {
		// try{
		const url = this.props.url;
		let options = Object.assign({}, this.state.options);
		let requestData = Object.assign({}, this.state.requestData);
		if(season){
			requestData.where=season
		}
		let self = this;
		let mySocket = window.io.sails.connect(`${process.env.REACT_APP_API_BASE_PATH}`);
		const urlParams = new URLSearchParams(Object.entries(requestData));
		let com = url.includes('?') ? '&' : '?';
		// await axios.get(url + com + urlParams.toString(),
		// JwtToken.getJwtTokenHeader())
		APIService.get(url + com + urlParams.toString(), null,
		response => {
				console.log('response_data ==>'+ JSON.stringify(response));

				let response_data = response.data;
				// let out_adapter = self.state.options.responseAdapter(response_data);
				let out_adapter={};
				out_adapter.data=response_data;
				out_adapter.total=response.total;
				if (out_adapter === undefined || !out_adapter ||
					typeof out_adapter !== 'object' || out_adapter.constructor !== Object ||
					!out_adapter.hasOwnProperty('data') || !out_adapter.hasOwnProperty('total')) {
					throw "You must return 'object' contains 'data' and 'total' attributes"
				} else if (out_adapter.data === undefined || out_adapter.total === undefined) {
					throw "Please check from returned data or your 'responseAdapter'. \n response must have 'data' and 'total' attributes.";
				}

				options.total = out_adapter.total;
				if (out_adapter.total === 0) {
					options.currentPage = 0;
					options.lastPage = 0;
					options.from = 0;
					options.to = 0;
				} else {
					options.currentPage = requestData.page;
					options.lastPage = Math.ceil(out_adapter.total / requestData.limit);
					options.from = requestData.limit * (requestData.page - 1) + 1;
					options.to = options.lastPage === options.currentPage ? options.total : requestData.limit * (requestData.page);
				}

				self.setState({data: out_adapter.data, options: options, isLoading: false});
			});
		// } 
	}

	handlePerPageChange(event) {
		const {name, value} = event.target;
		let options = Object.assign({}, this.state.options);
		let requestData = Object.assign({}, this.state.requestData);

		options.perPage = value;
		requestData.limit = event.target.value;
		requestData.page = 1;

		this.setState({requestData: requestData, options: options, isLoading: true}, () => {
			this.handleFetchData();
		});
	}

	handlePageChange(page) {
		let requestData = Object.assign({}, this.state.requestData);
		requestData.page = page;

		this.setState({requestData: requestData, isLoading: true}, () => {
			this.handleFetchData();
		});
	}

	handleSearchClick() {
		let query = this.table_search_input.current.value;
		let requestData = Object.assign({}, this.state.requestData);
		requestData.query = query;
		requestData.page = 1;

		this.setState({requestData: requestData, isLoading: true}, () => {
			this.handleFetchData();
		});
	}

	addNewRecordModal = (event) =>{
		this.props.openAddNewRecordModal();
	}

	render() {
		return (
			<div className="card">
				{
					(this.props.perPage || this.props.search) &&

					<div className="card-header text-center row">
						{
							this.props.perPage &&
							<div className="col-md-2">
								<span>{this.state.options.texts.show} </span>
								<label>
									<select className="form-control form-control-sm"
											onChange={this.handlePerPageChange}>
										{this.state.options.perPageValues.map(value => (
											<option key={value} value={value}>{value}</option>
										))}
									</select>
								</label>
								<span> {this.state.options.texts.entries}</span>
							</div>
						}

						{this.state.isLoading == true && 
							<div className='col-md-6'>
								{this.state.options.loading}
							</div>
						}

						{this.state.isLoading == false && 
							<div className='col-md-6'>
								<h3>
									{this.state.table_title}
								</h3>
							</div>
						}

						{
							this.props.search &&
							<div className='row col-md-4 form-group'>
								{ (this.props.allowToAdd) &&
									<button className="btn btn-info  waves-effect waves-light" id="addNewRecord" onClick={this.addNewRecordModal} disabled={!this.props.allowToAdd}>{this.state.add_new_button_title}</button>
								}
								<div className="input-icon input-group-sm ml-3">
									<input type="text" className="form-control w-100" style={{height: 35}}
										placeholder={this.state.options.texts.search} ref={this.table_search_input}
										onKeyUp={() => this.handleSearchClick()}/>

									<span className="input-icon-addon"><i className="fe fe-search"></i></span>
								</div>
							</div>
						}
					</div>
				}
				<div className="card-body">
					<div className="table-responsive" style={{maxHeight: this.props.options.maxHeightTable}}>
						<table className={this.tableClass()}>
							<thead>
							<tr>
								{this.renderColumns()}
							</tr>
							</thead>
							<tbody>
							{
								this.state.options.total > 0 ?
									this.renderData() :
									<tr className="text-center">
										<td colSpan={this.props.columns.length}>{this.state.options.texts.empty}</td>
									</tr>
							}
							</tbody>
						</table>
					</div>
				</div>
				<div className="card-footer clearfix">
					{
						this.props.pagination ?
							<div className="float-left">
								{this.state.options.texts.showing + ' ' + this.state.options.from + ' ' + this.state.options.texts.to + ' ' +
								this.state.options.to + ' ' + this.state.options.texts.of + ' ' + this.state.options.total +
								' ' + this.state.options.texts.entries}
							</div> :
							<div className="float-left">
								{
									this.state.options.total + ' ' + this.state.options.texts.entries
								}
							</div>
					}
					{
						this.props.pagination &&
						<ul className="pagination m-0 float-right">
							{this.renderPagination()}
						</ul>
					}
				</div>
			</div>
		);
	}
}

ServerTable.defaultProps = {
	options: {
		headings: {},
		sortable: [],
		columnsWidth: {},
		columnsAlign: {},
		initialPage: 1,
		perPage: 10,
		perPageValues: [10, 20, 25, 100],
		icons: {
			sortBase: 'fa fa-sort',
			sortUp: 'fa fa-sort-amount-up',
			sortDown: 'fa fa-sort-amount-down',
			search: 'fa fa-search'
		},
		texts: {
			show: 'Show',
			entries: 'entries',
			showing: 'Showing',
			to: 'to',
			of: 'of',
			search: 'Search',
			empty: 'No Results'
		},
		total: 10,
		currentPage: 1,
		lastPage: 1,
		from: 1,
		to: 1,
		loading: (
			<div style={{fontSize: 14, display: "initial"}}><span style={{fontSize: 18}}
																  className="fa fa-spinner fa-spin"/> Loading...
			</div>),
		responseAdapter: function (resp_data) {
			return {data: resp_data.data, total: resp_data.total}
		},
		maxHeightTable: 'unset'
	},
	perPage: true,
	search: true,
	pagination: true,
	refresh: true,
};

ServerTable.propTypes = {
	columns: PropTypes.array.isRequired,
	url: PropTypes.string.isRequired,

	hover: PropTypes.bool,
	bordered: PropTypes.bool,
	condensed: PropTypes.bool,
	striped: PropTypes.bool,
	perPage: PropTypes.bool,
	search: PropTypes.bool,
	pagination: PropTypes.bool,
	refresh: PropTypes.bool,

	options: PropTypes.object,
	children: PropTypes.func,
};


export default ServerTable;