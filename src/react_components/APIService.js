import axios from 'axios';
import PlannerStore from './planner/PlannerStore';
import OperationStore from './operations/OperationStore';
import MainStore from './MainStore';

class APIService {
  constructor() {
    let jwtToken = localStorage.getItem('ttl.accessToken');
    let service = axios.create({
			// headers:{
			// 	'Authorization': `Bearer ${jwtToken}`
			// }
		
    });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

getPlainJwtToken() {
    let jwtToken = localStorage.getItem('ttl.accessToken');
    return jwtToken;
}


async refreshToken(callback){
    let jwtRefreshToken = localStorage.getItem('ttl.refreshToken');
    // alert(jwtRefreshToken);
    if(jwtRefreshToken){
        await axios.get(`${process.env.REACT_APP_API_BASE_PATH}`+'/resetTokens', {
            headers:{
                'Authorization': `Bearer ${jwtRefreshToken}`
            }
            
        })
        .catch(function (error) {
            if (error.response && error.response.status=='444') {
                // alert('aila, logout !')
                //logout
                MainStore.logout()
            }
            return false;
        }).then(res => {
            if(res.data){
                
                localStorage.setItem("ttl.accessToken", res.data.token);
                localStorage.setItem("ttl.refreshToken", res.data.refreshToken);
                // alert("tokenrefreshed");
                // PlannerStore.initPlannerStore();
			    // OperationStore.initOperationStore();
                OperationStore.refreshOperationsDataOnly();
				PlannerStore.refreshPlannerDataOnly();	
                console.log(res);
                let service = axios.create({
                        headers:{
                            'Authorization': `Bearer ${res.data.token}`
                        }
                    
                });
                service.interceptors.response.use(this.handleSuccess, this.handleError);
                this.service = service;
                callback();
                return true;
            }
        });
        
    }
}

handleSuccess(response) {
    return response;
}

handleError = (error) => {
    switch (error.response.status) {
    case 401:
        console.log(401)
        return error.response;
        break;
    case 404:
        console.log(404)
        return error.response;
        break;
    case 444:
        console.log(444)
        return error.response;
        break;
    default:
          return error.response;
        // this.redikcrectTo(document, '/500')
        break;
    }
    return Promise.reject(error)
  }

  redirectTo = (document, path) => {
    document.location = path
  }
  
  //fetchData
get(path, params, callback) {
    let self=this;
    return this.service.request({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_PATH}${path}`,
        responseType: 'json',
        headers: {
            'Authorization': `Bearer ${self.getPlainJwtToken()}`
        },
        params: params
    }).then(
      (response) => {
        //refresh token if 444
        if(response.status==444){
            self.refreshToken(() => {
                self.get(path, params, callback);
            });
            return;
        }
        console.log(response.status, `${process.env.REACT_APP_API_BASE_PATH}${path}`);
        console.log(response.data);
        callback(response.data);
    }).catch((err) => {
        console.log(err);
    });
}

post(path, payload, callback) {
    let self = this;

    return this.service.request({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_PATH}${path}`,
        responseType: 'json',
        data: payload,
        headers: {
            'Authorization': `Bearer ${self.getPlainJwtToken()}`
        }
    }).then((response) =>{
        //refresh token if 444
        if(response.status==444){
            self.refreshToken(() => {
                self.post(path, payload, callback);
            });
            return;
        }
        callback(response.data);
       console.log(response.status);
       console.log(response.data);
    }).catch((err) =>{
        console.log(err);
    }) 
  }
}

export default new APIService;