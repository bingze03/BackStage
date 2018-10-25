import React from 'react';
import * as d3 from 'd3';
import $ from 'jquery';


export default class LineChart extends React.Component{
	constructor(props){
		super(props);
		this.state={
			'width':525,
			'height':350
		};
		{/*props={
			data,
			name
		}*/}
	}
	
	componentDidMount(){
		this.drawChart();
	}
	
	showValue(sumOfData,dataAmount,svg,scaleX,scaleY,Color='#ff8400'){
		const Height=this.state.height;
		const Width=this.state.width;
		const data=Object.entries(this.props.data);
		var focus=svg.append('g').attr('class','focus-total')
									.style('display','none');
		
		focus.append('line').attr('class','x-hover-line-total')
							.attr('stroke',Color)
							.attr('transform','translate(25,25)')
							.attr('y1','0')
							.attr('y2',Height);
		focus.append('line').attr('class','y-hover-line-total')
							.attr('x1',Width)
							.attr('x2',Width);
		focus.append('text').attr('class','text-total')
							.attr('x','16')
							.attr('dy','0.3em');
		
		svg.append('rect').attr('class','rect-total')
							.attr('transform','translate(25,25)')
							.attr('fill','none')
							.attr('pointer-events','all')
							.attr('width',Width)
							.attr('height',Height)
							.on('mouseover',function(){focus.style('display',null);for(var m=0; m<dataAmount; ++m)focuses[m].style('display',null);})
							.on('mouseout',function(){focus.style('display','none');for(var m=0; m<dataAmount; ++m)focuses[m].style('display','none');})
							.on('mousemove',move);
		
		for(var n=0; n<dataAmount; ++n)
		{
			focus=svg.append('g').attr('class','focus-'+data[n][0])
									.style('display','none');
		
			focus.append('line').attr('class','x-hover-line-'+data[n][0])
								.attr('stroke',Color)
								.attr('transform','translate(25,25)')
								.attr('y1','0')
								.attr('y2',Height);
			focus.append('line').attr('class','y-hover-line-'+data[n][0])
								.attr('x1',Width)
								.attr('x2',Width);
			focus.append('text').attr('class','text-'+data[n][0])
								.attr('x','36')
								.attr('dy','2em');
		}
		
		focus=svg.select('g.focus-total');
		var focuses=[];
		for(var m=0; m<dataAmount; ++m)
			focuses[m]=svg.select('g.focus-'+data[m][0]);
		
		const bisect = d3.bisector(function(d) { return sumOfData.indexOf(d);}).left;
		
		function move(){
			const valX=scaleX.invert(d3.mouse(this)[0])-1,
					i=bisect(sumOfData,valX,1),
					d0=sumOfData[i-1],
					d1=sumOfData[i],
					d=(valX-sumOfData.indexOf(d0))>(sumOfData.indexOf(d1)-valX)?d1:d0;
			
			var selector=[];
			selector.push(svg.selectAll('g.focus-total').attr('transform','translate('+scaleX(sumOfData.indexOf(d)+1)+','+scaleY(d)+')'));
			selector[0].select('text.text-total').text(function(){return d;});
			selector[0].select('line.x-hover-line-total').attr('y2',Height-scaleY(d));
			selector[0].select('line.y-hover-line-total').attr('x2',Width+Width);
			
			for(var n=0; n<dataAmount; ++n)
			{
				selector[n+1]=svg.selectAll('g.focus-'+data[n][0]).attr('transform','translate('+scaleX(sumOfData.indexOf(d)+1)+','+scaleY(data[n][1][sumOfData.indexOf(d)])+')');
				selector[n+1].select('text.text-'+data[n][0]).text(function(){return data[n][1][sumOfData.indexOf(d)]});
				selector[n+1].select('line.x-hover-line-'+data[n][0]).attr('y2',Height-scaleY(data[n][1][sumOfData.indexOf(d)]));
				selector[n+1].select('line.y-hover-line-'+data[n][0]).attr('x2',Width+Width);
			}
		}
	}
	
	drawChart(){
		const color=['#0090c0','#eb6f70','#40a880','#955694'];
		const data=this.props.data;
		const dataAmount=Object.keys(data).length;
		const svg=d3.select('svg#'+this.props.name).attr('width',600)
													.attr('height',400);
												
		var dataWidthDomain=Object.entries(data)[0][1].length;
		var sumOfData=Object.entries(data)[0][1].slice();
		
		if(dataAmount>1){
			var currentData={};
			for(var i=1;i<dataAmount;++i){
				currentData=Object.entries(data)[i][1];
				if(currentData.length>dataWidthDomain)
					dataWidthDomain=currentData.length;
				for(var j=0;j<currentData.length;++j)
					sumOfData[j]+=currentData[j];
			}
		}
		
		const scaleX=d3.scaleLinear()
					.domain([0,dataWidthDomain])
					.range([0,this.state.width]);
	
		const scaleY=d3.scaleLinear()
					.domain([0,d3.max(sumOfData)+10])
					.range([this.state.height,0]);		
		
		const line=d3.line()
					.x(function(d,i){return scaleX(i+1);})
					.y(function(d,i){return scaleY(d);});
		
		
		for(var i=0;i<dataAmount;++i){
			svg.append('g').append('path').attr('d',line(Object.entries(data)[i][1]))
							.attr('stroke',color[i%4])
							.attr('fill','none')
							.attr('transform','translate(25,25)');
										
			for(var j=0; j<Object.entries(data)[i][1].length;++j){				
				svg.append('circle').attr('cx',scaleX(j+1))
									.attr('cy',scaleY(Object.entries(data)[i][1][j]))
									.attr('r','3')
									.attr('transform','translate(25,25)')
									.attr('fill',color[i%4]);
			}
		}
			
		svg.append('path').attr('d',line(sumOfData))
						.attr('stroke','#ff8400')
						.attr('stroke-width','2.5')
						.attr('fill','none')
						.attr('transform','translate(25,25)');
						
		this.showValue(sumOfData,dataAmount,svg,scaleX,scaleY,'#ff8400');
						
		for(var i=0; i<sumOfData.length;++i)
			svg.append('circle').attr('cx',scaleX(i+1))
								.attr('cy',scaleY(sumOfData[i]))
								.attr('r','4')
								.attr('transform','translate(25,25)')
								.attr('fill','#ff8400');

		const axisX=d3.axisBottom(scaleX);
		const axisY=d3.axisLeft(scaleY);
		svg.select('#axisX').call(axisX).attr('stroke-width','2')
										.attr('transform','translate(25,375)');
		svg.select('#axisY').call(axisY).attr('stroke-width','2')
										.attr('transform','translate(25,25)');
		const gridX=d3.axisBottom(scaleX).tickFormat("").tickSize(-this.state.height,0);
		const gridY=d3.axisLeft(scaleY).tickFormat("").tickSize(-this.state.width,0);
		svg.select('#gridX').call(gridX)
							.attr('fill','none')
							.attr('stroke-width','0.2')
							.attr('transform','translate(25,375)');
		svg.select('#gridY').call(gridY)
							.attr('fill','none')
							.attr('stroke-width','0.2')
							.attr('transform','translate(25,25)');
	}
	
	
	render(){
		return (
			<svg id={this.props.name}>
				<g id='axisX'></g>
				<g id='axisY'></g>
				<g id='gridX'></g>
				<g id='gridY'></g>
			</svg>
		);
	}
}