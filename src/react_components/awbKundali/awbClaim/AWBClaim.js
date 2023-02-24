import React, { Component } from "react";
import { Button } from "react-bootstrap";
import axios from 'axios';
import AWBClaimChecklistRow from './AWBClaimChecklistRow';
import AWBClaimChecklistRowType from './AWBClaimChecklistRowType';
import custom from '../../../config/custom.js';
import MainStore from '../../MainStore.js'
import APIService from "../../APIService";

const row_data = [
	['mawb', 'Master Airway Bill', AWBClaimChecklistRowType.MANDATORY],
	['hawb', 'House Airway Bill', AWBClaimChecklistRowType.OPTIONAL],
	['deliveryreceipt', 'Delivery Receipt', AWBClaimChecklistRowType.OPTIONAL],
	['ba80record', 'BA80 record and history (if not available from BA80, please obtain it from "awbhist awbhist" Lotus Notes address)', AWBClaimChecklistRowType.MANDATORY],
	['cargomanifest', 'Cargo Manifest', AWBClaimChecklistRowType.TITLE],
	['alltransfer', 'All transfer manifest (to other carriers)', AWBClaimChecklistRowType.OPTIONAL],
	['alltruckmanifest', 'All trucking manifest', AWBClaimChecklistRowType.OPTIONAL],
	['exportcargomanifest', 'Export cargo manifest', AWBClaimChecklistRowType.MANDATORY],
	['importcargomanifest', 'Import cargo manifest', AWBClaimChecklistRowType.MANDATORY],
	['splprodchecklist', 'Special product checklist (if applicable for shipment involved in claim)', AWBClaimChecklistRowType.TITLE],
	['liveanimalchecklist', 'Live animal checklist', AWBClaimChecklistRowType.OPTIONAL],
	['dangergoodschecklist', 'Dangerous goods checklist', AWBClaimChecklistRowType.OPTIONAL],
	['healthcerts', 'Health certificates', AWBClaimChecklistRowType.OPTIONAL],
	['importlicenses', 'Import licenses', AWBClaimChecklistRowType.OPTIONAL],
	['anyreportraise', 'Any reports raised/issued', AWBClaimChecklistRowType.TITLE],
	['irregularityreport', 'Irregularity report', AWBClaimChecklistRowType.OPTIONAL],
	['damagereport', 'Damage report', AWBClaimChecklistRowType.OPTIONAL],
	['irregularity3rdparty', 'Any irregularity reports issued by 3rd party', AWBClaimChecklistRowType.OPTIONAL],
	['photoevidence', 'Any photographic evidence', AWBClaimChecklistRowType.OPTIONAL],
	['corrospondence', 'All corrospondence between parties', AWBClaimChecklistRowType.TITLE],
	['letterofintent', 'Letter of intent to claim (reserve letter)', AWBClaimChecklistRowType.OPTIONAL],
	['firmclaim', 'Firm claim', AWBClaimChecklistRowType.MANDATORY],
	['alltelexes', 'All telexes, email and letters exchanged within BAWC', AWBClaimChecklistRowType.MANDATORY],
	['shipperinstruction', 'Shipper\'s Instructions for Dispatch of Goods (IDG)', AWBClaimChecklistRowType.OPTIONAL],
	['writtencomm', 'All written communications between BAWC and claimant', AWBClaimChecklistRowType.MANDATORY],
	['telephonicnotes', 'Notes of any telephonic conversations with claimant regarding the claim', AWBClaimChecklistRowType.MANDATORY],
	['docprovidedbyclaimant', 'All documents provided by claimant (specify)', AWBClaimChecklistRowType.OPTIONAL],
	['otherdocs', 'Other documents (specify)', AWBClaimChecklistRowType.OPTIONAL],
];

export default class AWBClaim extends Component {

	/*hawb_no = '';
	house_pieces =  '';
	house_weight = '';

	claim_amount = 0;
	declared_value_for_carriage = undefined;

	claim_loss = false;
	claim_delay = false;
	claim_damage = false;
	claim_others = false;

	commodity = '';

	detailed_comments = '';

	documents = {};*/

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			hawb_no: '',
			house_pieces: '',
			house_weight: '',
			claim_amount: '',
			declared_value_for_carriage: false,
			date: "",
			claim_loss: false,
			claim_delay: false,
			claim_damage: false,
			claim_others: false,
			flight_data: this.props.awb_legs_completed,
			flight_number: '',
			flight_date: '',
			flight_from: '',
			flight_to: '',
			origin_station: '',
			commodity: this.props.awb_kundali_data.commodity,
			detailed_comments: '',
			status: custom.custom.awb_claim_status.provisional,
			documents: {},
			errors: {
				closing_house_pieces_error: '', closing_house_weight_error: '', closing_claim_amount_error: '', closing_detailed_comments_error: '', closing_commodity_error: '', closing_hawb_no_error: '', closing_comment_error: '',
				closing_otherdocs_error: '', closing_docprovidedbyclaimant_error: '', closing_shipperinstruction_error: '', closing_letterofintent_error: '', closing_photoevidence_error: '', closing_irregularity3rdparty_error: '', closing_damagereport_error: '',
				closing_irregularityreport_error: '', closing_importlicenses_error: '', closing_healthcerts_error: '', closing_dangergoodschecklist_error: '', closing_liveanimalchecklist_error: '', closing_alltruckmanifest_error: '',
				closing_alltransfer_error: '', closing_deliveryreceipt_error: ''
			},
		};
	}

	componentDidMount() {

		let awbLegClaimData = this.state.flight_data.filter(awbleg => awbleg.status === "COMPLETED");

		if (awbLegClaimData.length > 0) {
			let finaldataAwbLeg = awbLegClaimData[awbLegClaimData.length - 1]
			console.log(finaldataAwbLeg.station)
			let flight_departed_date = window.moment(finaldataAwbLeg.planned_departure).format("DD/MM/YYYY")
			this.setState({ flight_number: finaldataAwbLeg.flight_no, flight_date: flight_departed_date, flight_from: finaldataAwbLeg.from, flight_to: finaldataAwbLeg.to, origin_station: finaldataAwbLeg.station })
		}

		let today = new Date();
		let date = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
		this.setState({ date: date })
		this._getClaim();
	}

	_validateClaimForm = () => {

		//	TODO
		return true;
	}
	_submitClaim = () => {
		let errors = this.state.errors;
		if (!this.state.hawb_no) {
			errors.closing_hawb_no_error = 'Enter HAWB no ';
			this.setState({ errors });
		} else {
			errors.closing_hawb_no_error = '';
			this.setState({ errors });
		}
		if (!this.state.house_pieces) {
			errors.closing_house_pieces_error = 'Enter house pieces ';
			this.setState({ errors });
		} else {
			errors.closing_house_pieces_error = '';
			this.setState({ errors });
		}
		if (!this.state.house_weight) {
			errors.closing_house_weight_error = 'Enter weight ';
			this.setState({ errors });
		} else {
			errors.closing_house_weight_error = '';
			this.setState({ errors });
		}
		if (!this.state.claim_amount) {
			errors.closing_claim_amount_error = 'Enter claim amount ';
			this.setState({ errors });
		} else {
			errors.closing_claim_amount_error = '';
			this.setState({ errors });
		}

		if (!this.state.detailed_comments) {
			errors.closing_detailed_comments_error = 'Enter detailed comments ';
			this.setState({ errors });
		} else {
			errors.closing_detailed_comments_error = '';
			this.setState({ errors });
		}
		if (this.state.claim_others == true) {
			if (!this.state.commodity) {
				errors.closing_commodity_error = 'Enter commodity ';
				this.setState({ errors });
			} else {
				errors.closing_commodity_error = '';
				this.setState({ errors });
			}
		}

		if (this._validateClaimForm) {
			console.log('station', this.state.station)
			console.log('hawb_no', this.state.hawb_no);
			console.log('house_pieces', this.state.house_pieces);
			console.log('house_weight', this.state.house_weight);
			console.log('claim_amount', this.state.claim_amount);
			console.log('declared_value_for_carriage', this.state.declared_value_for_carriage);
			console.log('claim_loss', this.state.claim_loss);
			console.log('claim_delay', this.state.claim_delay);
			console.log('claim_damage', this.state.claim_damage);
			console.log('claim_others', this.state.claim_others);
			console.log('commodity', this.state.commodity);
			console.log('detailed_comments', this.state.detailed_comments);
			console.log('documents', this.state.documents);
			if ("hawb" in this.state.documents) {
				if (this.state.documents.hawb.comment == null && this.state.documents.hawb.no_doc == true) {
					errors.closing_comment_error = 'Fill the hawb field ';
					this.setState({ errors });
				} else {
					errors.closing_comment_error = '';
					this.setState({ errors });
				}
			} else {
				console.log(false)
			}
			if ("deliveryreceipt" in this.state.documents) {
				if (this.state.documents.deliveryreceipt.comment == null && this.state.documents.deliveryreceipt.no_doc == true) {
					errors.closing_deliveryreceipt_error = 'Fill the delivery receipt feild ';
					this.setState({ errors });
				} else {
					errors.closing_deliveryreceipt_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("alltransfer" in this.state.documents) {
				if (this.state.documents.alltransfer.comment == null && this.state.documents.alltransfer.no_doc == true) {
					errors.closing_alltransfer_error = 'Fill the all transfer field ';
					this.setState({ errors });
				} else {
					errors.closing_alltransfer_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("alltruckmanifest" in this.state.documents) {
				if (this.state.documents.alltruckmanifest.comment == null && this.state.documents.alltruckmanifest.no_doc == true) {
					errors.closing_alltruckmanifest_error = 'Fill the all trucking manifest field ';
					this.setState({ errors });
				} else {
					errors.closing_alltruckmanifest_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("liveanimalchecklist" in this.state.documents) {
				if (this.state.documents.liveanimalchecklist.comment == null && this.state.documents.liveanimalchecklist.no_doc == true) {
					errors.closing_liveanimalchecklist_error = 'Fill live animal checklist field ';
					this.setState({ errors });
				} else {
					errors.closing_liveanimalchecklist_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("dangergoodschecklist" in this.state.documents) {
				if (this.state.documents.dangergoodschecklist.comment == null && this.state.documents.dangergoodschecklist.no_doc == true) {
					errors.closing_dangergoodschecklist_error = 'Fill danger goods checklist field ';
					this.setState({ errors });
				} else {
					errors.closing_dangergoodschecklist_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("healthcerts" in this.state.documents) {
				if (this.state.documents.healthcerts.comment == null && this.state.documents.healthcerts.no_doc == true) {
					errors.closing_healthcerts_error = 'Fill the healthcerts field ';
					this.setState({ errors });
				} else {
					errors.closing_healthcerts_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("importlicenses" in this.state.documents) {
				if (this.state.documents.importlicenses.comment == null && this.state.documents.importlicenses.no_doc == true) {
					errors.closing_importlicenses_error = 'Fill the import licenses field ';
					this.setState({ errors });
				} else {
					errors.closing_importlicenses_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("irregularityreport" in this.state.documents) {
				if (this.state.documents.irregularityreport.comment == null && this.state.documents.irregularityreport.no_doc == true) {
					errors.closing_irregularityreport_error = 'Fill the irregularity report field ';
					this.setState({ errors });
				} else {
					errors.closing_irregularityreport_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("damagereport" in this.state.documents) {
				if (this.state.documents.damagereport.comment == null && this.state.documents.damagereport.no_doc == true) {
					errors.closing_damagereport_error = 'Fill the damage report field ';
					this.setState({ errors });
				} else {
					errors.closing_damagereport_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("irregularity3rdparty" in this.state.documents) {
				if (this.state.documents.irregularity3rdparty.comment == null && this.state.documents.irregularity3rdparty.no_doc == true) {
					errors.closing_irregularity3rdparty_error = 'Fill the Irregularity 3rd party field ';
					this.setState({ errors });
				} else {
					errors.closing_irregularity3rdparty_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("photoevidence" in this.state.documents) {
				if (this.state.documents.photoevidence.comment == null && this.state.documents.photoevidence.no_doc == true) {
					errors.closing_photoevidence_error = 'Fill the photo evidence field ';
					this.setState({ errors });
				} else {
					errors.closing_photoevidence_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("letterofintent" in this.state.documents) {
				if (this.state.documents.letterofintent.comment == null && this.state.documents.letterofintent.no_doc == true) {
					errors.closing_letterofintent_error = 'Fill the letter of Intent field ';
					this.setState({ errors });
				} else {
					errors.closing_letterofintent_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("shipperinstruction" in this.state.documents) {
				if (this.state.documents.shipperinstruction.comment == null && this.state.documents.shipperinstruction.no_doc == true) {
					errors.closing_shipperinstruction_error = 'Fill the Shipper Instruction field ';
					this.setState({ errors });
				} else {
					errors.closing_shipperinstruction_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("docprovidedbyclaimant" in this.state.documents) {
				if (this.state.documents.docprovidedbyclaimant.comment == null && this.state.documents.docprovidedbyclaimant.no_doc == true) {
					errors.closing_docprovidedbyclaimant_error = 'Fill the document Provided by Claimant field ';
					this.setState({ errors });
				} else {
					errors.closing_docprovidedbyclaimant_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			if ("otherdocs" in this.state.documents) {
				if (this.state.documents.otherdocs.comment == null && this.state.documents.otherdocs.no_doc == true) {
					errors.closing_otherdocs_error = 'Fill the otherdocs field ';
					this.setState({ errors });
				} else {
					errors.closing_otherdocs_error = '';
					this.setState({ errors });
				}
			}
			else {
				console.log(false)
			}
			let error_count = Object.keys(errors).filter((key) => {
				if (errors[key]) {
					return false;
				}
				return true;
			}).length;
			let error_type_count = Object.keys(errors).length;
			if (error_count < error_type_count) {
				console.log('yes errors' + error_count + ' ==> ' + JSON.stringify(this.state.errors))
				window.swal_error('Please fill mandatory fields !');
			} else {
				console.log('no errors' + error_count + ' ==> ' + JSON.stringify(this.state.errors));
				APIService.post('/saveClaim'
				// , data)
				// axios.post(`${process.env.REACT_APP_API_BASE_PATH}/saveClaim`
				, {
					station: this.props.awb_kundali_data.awb_info.station,
					awb_no: this.props.awb_kundali_data.awb_no,
					hawb_no: this.state.hawb_no,
					house_pieces: this.state.house_pieces,
					house_weight: this.state.house_weight,
					claim_amount: this.state.claim_amount,
					declared_value_for_carriage: this.state.declared_value_for_carriage,
					claim_loss: this.state.claim_loss,
					claim_delay: this.state.claim_delay,
					claim_damage: this.state.claim_damage,
					claim_others: this.state.claim_others,
					commodity: this.props.awb_kundali_data.commodity,
					detailed_comments: this.state.detailed_comments,
					documents: this.state.documents,
					status: this.state.status,
				}
				// ,JwtToken.getJwtTokenHeader()
				,function (response) {
					if (response.data.errormsg) {
						console.log(response.data.errormsg);
					} else {
						console.log(response.data);
						window.swal_success('The Claim is saved !');
					}
				});
			}

		} else {
			//alert('WTH');
		}
	}

	_getClaim = () => {
		// axios.get(`${process.env.REACT_APP_API_BASE_PATH}/getClaim/` + this.props.awb_kundali_data.awb_no,
		// JwtToken.getJwtTokenHeader())
		APIService.get('/getClaim/' + this.props.awb_kundali_data.awb_no, null,
		function (response) {
			if (response.errormsg) {
				console.error(response.errormsg);
				this.setState({ loading: false });
			} else {
				this.setState({
					station: this.props.awb_kundali_data.station,
					awb_no: this.props.awb_kundali_data.awb_no,
					hawb_no: response.data.hawb_no,
					house_pieces: response.data.house_pieces,
					house_weight: response.data.house_weight,
					claim_amount: response.data.claim_amount,
					declared_value_for_carriage: response.data.declared_value_for_carriage,
					claim_loss: response.data.claim_loss,
					claim_delay: response.data.claim_delay,
					claim_damage: response.data.claim_damage,
					claim_others: response.data.claim_others,
					commodity: this.props.awb_kundali_data.commodity,
					detailed_comments: response.data.detailed_comments,
					documents: response.data.documents,
					status: response.data.status,

					loading: false
				});

			}
		}.bind(this));
	}

	_getClone = (object) => {
		return JSON.parse(JSON.stringify(object));
	}

	_onCheckboxChanged = (event) => {

		console.log('id', event.target.id);
		console.log('checked', event.target.checked);
		switch (event.target.id) {
			case 'claim_loss':
				this.setState({ claim_loss: event.target.checked });
				break;
			case 'claim_delay':
				this.setState({ claim_delay: event.target.checked });
				break;
			case 'claim_damage':
				this.setState({ claim_damage: event.target.checked });
				break;
			case 'claim_others':
				this.setState({ claim_others: event.target.checked });
				break;
			case 'declared_value_for_carriage':
				this.setState({ declared_value_for_carriage: event.target.checked });
				break;
			case 'declared_value_for_carriage_no':
				this.setState({ declared_value_for_carriage: false });
				break;
			default:
		}
	}

	_onTextChange = (e) => {
		console.log(e.target.value);
		switch (e.target.id) {
			case 'hawb_no':
				// let errors = this.state.errors;
				// let validationRules = [{ text: e.target.value, regex_name: 'exact_x_digits', errmsg: 'Please enter 11 digits', x_count: 11, required: true }];

				// let isValidatedhawbno = window.validate(validationRules);
				// if (isValidatedhawbno.errmsg) {
				// 	this.state.errors.closing_hawb_no_error = isValidatedhawbno.errmsg;
				// 	this.setState(errors);
				// } else {
				// 	this.state.errors.closing_hawb_no_error = '';
				// 	this.setState(errors);
				// 	this.setState({ hawb_no: e.target.value });
				// }

				this.setState({ hawb_no: e.target.value });
				break;
			case 'house_pieces':
				let errors_house_pieces = this.state.errors;
				let validationRuleshouse_pieces = [{ text: e.target.value, regex_name: 'max_number', errmsg: `Please enter maximum ${this.props.awb_info_pieces} Piece`, max: `${this.props.awb_info_pieces}`, required: true }];

				let isValidatedhousepieces = window.validate(validationRuleshouse_pieces);
				if (isValidatedhousepieces.errmsg) {
					this.state.errors.closing_house_pieces_error = isValidatedhousepieces.errmsg;
					this.setState(errors_house_pieces);
				} else {
					this.state.errors.closing_house_pieces_error = '';
					this.setState(errors_house_pieces);
					this.setState({ house_pieces: e.target.value });
				}
				this.setState({ house_pieces: e.target.value });
				break;
			case 'house_weight':
				let errors_house_weight = this.state.errors;
				let validationRuleshouse_weight = [{ text: e.target.value, regex_name: 'min_number', errmsg: "Please enter valid weight", min: 0.1, required: true }];

				let isValidatedhouseweight = window.validate(validationRuleshouse_weight);
				if (isValidatedhouseweight.errmsg) {
					this.state.errors.closing_house_weight_error = isValidatedhouseweight.errmsg;
					this.setState(errors_house_weight);
				} else {
					this.state.errors.closing_house_weight_error = '';
					this.setState(errors_house_weight);
					this.setState({ house_weight: e.target.value });
				}
				this.setState({ house_weight: e.target.value });
				break;
			case 'claim_amount':
				// let errors_claim_amount = this.state.errors;
				// let validationRulesclaim_amount = [{ text: e.target.value, regex_name: 'any_number', errmsg: `Please enter valid amount`, required: true }];

				// let isValidatedclaimamount = window.validate(validationRulesclaim_amount);
				// if (isValidatedclaimamount.errmsg) {
				// 	this.state.errors.closing_claim_amount_error = isValidatedclaimamount.errmsg;
				// 	this.setState(errors_claim_amount);
				// } else {
				// 	this.state.errors.closing_claim_amount_error = '';
				// 	this.setState(errors_claim_amount);
				// 	this.setState({ claim_amount: e.target.value });
				// }
				this.setState({ claim_amount: Number(e.target.value) });
				break;
			case 'commodity':
				this.setState({ commodity: e.target.value });
				break;
			case 'detailed_comments':
				let errors_detailed_comments = this.state.errors;
				let validationRulesdetailed_comments = [{ text: e.target.value, regex_name: 'free_text', errmsg: ' Details comments are too small', min: 5 },
				{ tagid: 'address', text: e.target.value, regex_name: 'free_text', errmsg: 'Details comments are too large', max: 3000 }];

				let isValidateddetailedcomments = window.validate(validationRulesdetailed_comments);
				if (isValidateddetailedcomments.errmsg) {
					this.state.errors.closing_detailed_comments_error = isValidateddetailedcomments.errmsg;
					this.setState(errors_detailed_comments);
				} else {
					this.state.errors.closing_detailed_comments_error = '';
					this.setState(errors_detailed_comments);
					this.setState({ detailed_comments: e.target.value });
				}
				this.setState({ detailed_comments: e.target.value });
				break;
			default:
		}
	}

	_onStatusChanged = (event) => {
		this.setState({ status: event.target.id });
	}

	_onDocumentSelected = (id, selected) => {
		console.log('document selected = ', id, selected);
		let documents = this._getClone(this.state.documents);
		if (documents[id] === undefined)
			documents[id] = {};
		documents[id]['doc'] = selected;
		documents[id]['no_doc'] = false;
		documents[id]['comment'] = undefined;
		console.log(documents)
		this.setState({ documents: documents });
	}

	_onDocumentNASelected = (id, selected) => {
		console.log('NA document selected = ', id, selected);
		let documents = this._getClone(this.state.documents);
		if (documents[id] === undefined)
			documents[id] = {};
		documents[id]['no_doc'] = selected;
		documents[id]['doc'] = false;
		documents[id]['comment'] = undefined;
		console.log(documents);
		this.setState({ documents: documents });
	}

	_onCommentAdded = (id, comment) => {
		console.log(id, comment);
		let documents = this._getClone(this.state.documents);
		if (documents[id] === undefined)
			documents[id] = {};
		documents[id]['comment'] = comment;
		this.setState({ documents: documents });
	}

	render() {
		// alert("jfjgkdjfh")
		if (this.state.loading)
			return (
				<div className='text-center'>
					Fetching the claims data... one moment please.
				</div>
			)


		return (
			<div>
				<div className='border border-secondary alert-warning px-5 py-2'>
					<div className='text-center'><h4>S T A T U S</h4></div>
					<table style={{ width: '100%' }} border={0}>
						<tbody>
							<tr>
								{
									Object.keys(custom.custom.awb_claim_status).map((status) => {
										status = custom.custom.awb_claim_status[status];
										return (
											<td key={status.id}>
												<input id={status} type="radio" name="status" className='mx-2' onClick={this._onStatusChanged} checked={status === this.state.status} />
												<label>{status}</label>
											</td>
										);
									})
								}
							</tr>
						</tbody>
					</table>
				</div>

				<table style={{ border: 'solid' }} border={0}>
					<tbody>
						<tr>
							<td colSpan={6} align="center"><u>BRITISH AIRWAYS CARGO CLAIM SUMMARY FORM</u>
							</td>
						</tr>
						<tr>
							<td colSpan={6}>
								<br />
							</td>
						</tr>
						<tr>
							<td colSpan={6} align="center">To be completed in full by the Station submitting claim to the Cargo Claims Unit. If this form is not completed the file will be returned to origin and the station will be non-conformed. Shadowed boxes are mandatory</td>
						</tr>
						<tr>
							<td colSpan={6}>
								<br />
							</td>
						</tr>
						<tr>
							<td colSpan={2}>SUBMITTING STATION CODE</td>
							<td><strong>{this.props.awb_kundali_data.station}</strong>
							</td>
							<td colSpan={2}>STATION REFERENCE</td>
							<td><strong className=''>{this.state.origin_station}</strong>
							</td>
						</tr>
						<tr>
							<td>Master AWB NR</td>
							<td> <strong>{this.props.awb_kundali_data.awb_no}</strong>
							</td>
							<td>NR OF PIECES [Mawb]</td>
							<td> <strong>{this.props.awb_kundali_data.pieces}</strong>
							</td>
							<td>WEIGHT [Mawb]</td>
							<td> <strong>{this.props.awb_kundali_data.weight}</strong>
							</td>
						</tr>
						<tr>
							<td>House AWB NR</td>
							<td>
								<input id='hawb_no' type="text" value={this.state.hawb_no} onChange={this._onTextChange} />
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.closing_hawb_no_error ? this.state.errors.closing_hawb_no_error : ""}
								</label>
							</td>
							<td>NR OF PIECES [Hawb]</td>
							<td>
								<input id='house_pieces' type="text" value={this.state.house_pieces} onChange={this._onTextChange} />
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.closing_house_pieces_error ? this.state.errors.closing_house_pieces_error : ""}
								</label>
							</td>
							<td>WEIGHT [Hawb]</td>
							<td>
								<input id='house_weight' type="text" value={this.state.house_weight} onChange={this._onTextChange} />
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.closing_house_weight_error ? this.state.errors.closing_house_weight_error : ""}
								</label>
							</td>
						</tr>
						<tr>
							<td colSpan={6}>
								<br />
							</td>
						</tr>
						<tr className=''>
							<td />
							<td colSpan={2}>{this.state.flight_number}</td>
							{/* {window.moment(this.state.flight_date).format("DD/MM/YYYY")} */}
							<td>{this.state.flight_date}</td>
							<td>{this.state.flight_from}</td>
							<td>{this.state.flight_to}</td>
						</tr>
						{(this.props.awb_legs && this.props.awb_legs.length > 0) &&
							this.props.awb_legs.map((awb_leg, index) => (
								<tr className='alert-secondary'>
									<td>{index + 1}</td>
									<td colSpan={2}>{awb_leg.flight_no}</td>
									<td>{window.moment(awb_leg.planned_departure).format("DD/MM/YYYY")}</td>
									<td>{awb_leg.from}</td>
									<td>{awb_leg.to}</td>
								</tr>
							))
						}
						<tr>
							<td colSpan={6}>
								<br />
							</td>
						</tr>
						<tr>
							<td colSpan={2}>AMOUNT OF CLAIM</td>
							<td>
								<input id='claim_amount' type="text" value={this.state.claim_amount} onChange={this._onTextChange} />
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.closing_claim_amount_error ? this.state.errors.closing_claim_amount_error : ""}
								</label>
							</td>
							<td colSpan={2}>DECLARED VALUE FOR CARRIAGE</td>
							<td>
								<input id='declared_value_for_carriage' type="radio" name='declared_value_for_carriage' checked={this.state.declared_value_for_carriage} onChange={this._onCheckboxChanged} />
								<label className='mr-3'>Yes</label>
								<input id='declared_value_for_carriage_no' type="radio" name='declared_value_for_carriage' checked={!this.state.declared_value_for_carriage} onChange={this._onCheckboxChanged} />
								<label>No</label>
							</td>
						</tr>
						<tr>
							<td colSpan={6}>
								<br />
							</td>
						</tr>
						<tr>
							<td colSpan={6} align="center">Details of circumstances giving rise to claim:</td>
						</tr>
						<tr>
							<td rowSpan={4} colSpan={3} align="center">Type of claim [tick as appropriate]</td>
							<td>
								<input id='claim_loss' type="checkbox" checked={this.state.claim_loss} onChange={this._onCheckboxChanged} />
								<label>LOSS</label>
							</td>
						</tr>
						<tr>
							<td>
								<input id='claim_delay' type="checkbox" checked={this.state.claim_delay} onChange={this._onCheckboxChanged} />
								<label>DELAY</label>
							</td>
						</tr>
						<tr>
							<td>
								<input id='claim_damage' type="checkbox" checked={this.state.claim_damage} onChange={this._onCheckboxChanged} />
								<label>DAMAGE</label>
							</td>
						</tr>
						<tr>
							<td>
								<input id='claim_others' type="checkbox" checked={this.state.claim_others} onChange={this._onCheckboxChanged} />
								<label>OTHER (specify)</label>
							</td>
						</tr>
						<tr>
							<td colSpan={3}>COMMODITY [as per field 6 in BA80]</td>
							<td colSpan={3}>
								<input id='commodity' type="text" style={{ width: '100%' }} value={this.state.commodity ? this.state.commodity : this.props.awb_kundali_data.commodity} disabled={!this.state.claim_others} onChange={this._onTextChange} />
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.closing_commodity_error ? this.state.errors.closing_commodity_error : ""}
								</label>
							</td>
						</tr>
						<tr>
							<td colSpan={6}>
								<br />
							</td>
						</tr>
						<tr>
							<td colSpan={6}>Give the details as per instructions and examples in SOP Q01 appendix B</td>
						</tr>
						<tr>
							<td colSpan={6}>
								<textarea id='detailed_comments' rows={10} cols={0} style={{ resize: 'none', width: '100%' }} defaultValue={this.state.detailed_comments} onChange={this._onTextChange} />
								<label className="col-md-12 text-danger" style={{ fontSize: "14px", fontWeight: " 400" }}>
									{this.state.errors.closing_detailed_comments_error ? this.state.errors.closing_detailed_comments_error : ""}
								</label>
							</td>
						</tr>
						<tr>
							<td />
							<td>COMPLETED BY</td>
							<td className=''>{MainStore.user.username}</td>
							<td />
							<td>Date</td>
							<td className=''>{this.state.date}</td>
						</tr>
					</tbody>
				</table>
				<br />
				<table border={1}>
					<tbody>
						<tr>
							<td colSpan={4} align="center"><strong>DOCUMENTS CHECKLIST FORM</strong>
							</td>
						</tr>
						<tr>
							<td colSpan={4}>Documents to attach to Cargo Claim Summary. Tick the "N/A" column if the document is not available for the claim and explain why. Insufficiant documentation will lead to claim not being processed and station non-conformance. Documents should be attached to summary in this order.</td>
						</tr>
						<tr>
							<td colSpan={2}>Tick each document attached to the Cargo Claim Summary Form</td>
							<td>N/A</td>
							<td>Explain why document is not available. Where black, document is mandatory and comment is not required.</td>
						</tr>
						{
							row_data.map(row => (<AWBClaimChecklistRow key={row[0]} data={row} onDocumentSelected={this._onDocumentSelected} onDocumentNASelected={this._onDocumentNASelected} onCommentAdded={this._onCommentAdded} initialValues={this.state.documents[row[0]]} closing_deliveryreceipt_error={this.state.errors.closing_deliveryreceipt_error} closing_comment_error={this.state.errors.closing_comment_error}
								closing_alltransfer_error={this.state.errors.closing_alltransfer_error} closing_alltruckmanifest_error={this.state.errors.closing_alltruckmanifest_error} closing_liveanimalchecklist_error={this.state.errors.closing_liveanimalchecklist_error} closing_dangergoodschecklist_error={this.state.errors.closing_dangergoodschecklist_error} closing_healthcerts_error={this.state.errors.closing_healthcerts_error}
								closing_importlicenses_error={this.state.errors.closing_importlicenses_error} closing_irregularityreport_error={this.state.errors.closing_irregularityreport_error} closing_letterofintent_error={this.state.errors.closing_letterofintent_error}
								closing_damagereport_error={this.state.errors.closing_damagereport_error} closing_irregularity3rdparty_error={this.state.errors.closing_irregularity3rdparty_error}
								closing_otherdocs_error={this.state.errors.closing_otherdocs_error} closing_shipperinstruction_error={this.state.errors.closing_shipperinstruction_error} closing_docprovidedbyclaimant_error={this.state.errors.closing_docprovidedbyclaimant_error} closing_photoevidence_error={this.state.errors.closing_photoevidence_error} />))
						}

					</tbody>
				</table>
				<div className='text-center my-2'>
					<Button onClick={() => this._submitClaim()}>Submit</Button>
				</div>
			</div>
		);
	}
}