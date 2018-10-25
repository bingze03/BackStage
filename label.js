import React from 'react';
import {Grid,Row,Col} from 'react-bootstrap/lib';
import {Label} from 'react-bootstrap/lib';


export default class LabelTag extends React.Component{
	constructor(props){
		super(props);
		this.state={
			'title':props.title,
			'value':props.value,
			'bgc':props.bgc
		}
	}
	
	render(){
		return (
			<div>
				<div style={{fontSize:20}}>
					<Label style={{marginRight:-20,
								paddingRight:20,
								backgroundColor:this.state.bgc}}>{this.state.title}</Label>
					<Label style={{borderLeft:'white solid',
								borderLeftWidth:2,
								borderTopLeftRadius:0,
								borderBottomLeftRadius:0,
								marginLeft:10,
								backgroundColor:this.state.bgc}}>{this.state.value}</Label>
				</div>
			</div>
		);
	}
}