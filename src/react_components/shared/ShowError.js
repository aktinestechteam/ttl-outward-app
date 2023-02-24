import React from 'react'

function ShowError(props) {
	return(<span className={'text-danger'}>{props.text}</span>);
}

export default ShowError;