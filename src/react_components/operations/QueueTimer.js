import React, { Component } from 'react'
import { Observer } from "mobx-react"


class QueueTimer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			trigger_time: props.trigger_time,
			// operation_window_time : props.queue_duration*60*1000,  //    This value you will get from the settings 
			operation_window_time : props.cut_off_time-props.trigger_time,
			each_operation_time : props.cut_off_time,    //    This value you will get from the settings
			timeout_id : undefined,
			background_color : " bg-light ",
			font_color : " text-dark ",
			counter : 1
		}
	}

	// shouldComponentUpdate(){
	// 	return true;
	// }
	
	componentDidMount(){
		this.setQueueTimer();
	}

	componentWillUnmount() {
		if(this.state.timeout_id) {
			console.log("clearing timer");
			clearTimeout(this.state.timeout_id);
		}
	}
	
	setQueueTimer () {
		let response = this.getTimeoutInterval();

		console.log(this.state.counter + ' - starting for timeout_interval = ' + response.timeout_interval/1000 + ', BG Color = [' + response.bg_color + '], Text Color = [' + response.text_color + '], ' + new Date());
		let timeout_id = setTimeout(()=>{
			//console.log(counter + ' - ' + new Date());
			this.setState({
				counter : this.state.counter + 1
			});

			if(response.timeout_interval > 0) {
				this.setQueueTimer(response.timeout_interval);
			}else{
				console.log('TIMEOUT');
				clearTimeout(this.state.timeout_id);
				this.setState({timeout_id: undefined});
			}
		}, response.timeout_interval);
		
		this.setState({
			background_color : " " + response.bg_color + " ",
			font_color : " " + response.text_color + " " ,
			timeout_id : timeout_id
		});
	}

	getTimeoutInterval () {
		let now_date = Date.now();
		let remaining_time = (this.state.trigger_time + this.state.operation_window_time) - now_date;
		let response = {};
		
		{
			let operation_last_window = this.state.each_operation_time * 1.5;
			if(remaining_time > 0) {
				if (remaining_time < operation_last_window) {
					response.bg_color = 'bg-light';
					response.text_color = 'text-danger';
				} else {
					let balance_base_time = this.state.operation_window_time - operation_last_window;
					let percentage_time_remaining = ((remaining_time - operation_last_window) * 100 ) / balance_base_time;
					
					if(percentage_time_remaining > 66) {
						response.bg_color = 'bg-success';
						response.text_color = 'text-light';
					} else if(percentage_time_remaining < 66 && percentage_time_remaining > 33) {
						response.bg_color = 'bg-light';
						response.text_color = 'text-success';
					} else if(percentage_time_remaining < 33) {
						response.bg_color = 'bg-warning';
						response.text_color = 'text-light';
					}
				}
			}
		}
		
		//console.log('Date.now() = '  + now_date);
		//console.log('trigger_time = '  + this.state.trigger_time);
		//console.log('operation_window_time = '  + this.state.operation_window_time);
		//console.log('remaining_time = '  + remaining_time);
		//console.log('=============================');
		
		if(remaining_time < this.state.operation_window_time && remaining_time > 60 * 1000) {
			response.timeout_interval = (remaining_time % (60*1000));    //    1 min
		} else if (remaining_time < 60 * 1000 && remaining_time > 20 * 1000) {
			response.timeout_interval = (remaining_time % (10 * 1000)); //    10 secs
		} else if (remaining_time > 0 && remaining_time < 20 * 1000){
			response.timeout_interval = (remaining_time % (1 * 1000)) //    1 sec
		} else {
			response.timeout_interval = 0;
			response.bg_color = 'bg-danger';
			response.text_color = 'text-light';
		}
		
		return response;
	}

	render(){
		
		let time = this.state.trigger_time + this.state.operation_window_time - Date.now();
		// console.log('===++time inside queuetimer == '+ time);
		//- let calculated_time =  new Date(time).getTime();
		let time_to_show = " X ";
		let parameter = " --- ";
		if (time > 60000){
			time_to_show = new Date(time); 
			//- here we have to do adjustment to show the time with current timezone bcz we are working on time stamp so without this adjustment it will add minutes wrt gmt to the time "if the milisecond value goes beyond 1hr then this adjustment will fails to show minutes"
			time_to_show.setMinutes(0);
			time_to_show.setSeconds(0);
			time_to_show.setMilliseconds(time);
			time_to_show = time_to_show.getMinutes(); 
			parameter = ' min ';
		} else if (time < 60000 && time >= 0){
			let seconds = new Date(time).getSeconds();
			if(seconds > 20) {
				seconds = Math.ceil(seconds/10)*10;
			}
			time_to_show = seconds;
			parameter = 'sec';
		}
		
		return(	
			<Observer>{()=>
			<div className={this.state.background_color + this.state.font_color + " m-0 p-0 "} >
					<div className=" m-0 p-auto text-center">
						<small>{time_to_show}</small>
					</div>
					<div className="m-0 py-0 px-1">
						<small>{parameter}</small>
					</div>
			</div>
			}</Observer>			
			
		);
	}
}

export default QueueTimer;