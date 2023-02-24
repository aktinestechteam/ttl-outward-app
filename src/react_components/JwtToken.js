

class JwtToken {

	getJwtTokenHeader(){
		
		let jwtToken = localStorage.getItem('ttl.jwt');
		let token={
			headers:{
				'Authorization': `Bearer ${jwtToken}`
			}
		}
		return token;

	}
	getPlainJwtToken() {
		
		let jwtToken = localStorage.getItem('ttl.jwt');
		
		return jwtToken;

	}
}

export default new JwtToken