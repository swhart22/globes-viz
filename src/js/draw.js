//import _ from 'lodash';
import '../css/nbcotsbase.css';
import * as d3 from 'd3';
import colors from './colors.js';
//const L = require("leaflet");
//import sheetsy from 'sheetsy';
//const {urlToKey, getWorkbook, getSheet } = sheetsy;
//import metadata from './proj-config.js';

function draw(Globes){
	console.log(Globes);
	Globes = Globes.filter(g => {return (g['NOM'] + ' ' +  g['Year']) != 'Kate Winslet 2009'})
	
	var years = d3.nest().key(d => {return d['Year'];}).key(d => {return d['GLOBES WIN_x'] + ' ' + d['OSCARS WIN_y']}).entries(Globes);
	years.sort((x, y) => {
		return d3.descending(+x.key, +y.key);
	});
	years = years.filter(d =>{return d.key != 'undefined'});
	
	d3.select('#wins')
		.text(() => {
			var winglobe = Globes.filter(g => {return g['GLOBES WIN_x'] == 'Winner'});
			var winwin = Globes.filter(g => {return g['GLOBES WIN_x'] == 'Winner' && g['OSCARS WIN_y'] == 'YES'});
			return Math.round((winwin.length / winglobe.length) * 100);
		});

	d3.select('#nom-overlap')
		.text(() => {
			return Math.round(Globes.length / years.length);
		});
	console.log(years);
	var container = d3.select('#container');
	var width = parseInt(d3.select('#container').style('width'));
	var height = parseInt(d3.select('#container').style('height'));
	var margin = {top: 30, left: 10, right:10, bottom: 10};
	var cWidth = width - margin.left - margin.right;
	var cHeight = height - margin.top - margin.bottom;
	var svg = container.append('svg')
		.attr('width',width)
		.attr('height',height);

	var tooltip = d3.select('body').append('div')
		.attr('id','tooltip')
		.html('<p><span id="nom-title"></span> <span id="addtl-info"></span></p>'+
			'<p><span id="globe-win-hook"></span><span id="globe-cat"></span></p>' + 
			'<p><span id="osc-win-hook"></span><span id="osc-cat"></span></p>'
			)
		.style('display','none')
		.style('position','absolute');

	var g = svg.append('g')
		.attr('transform','translate(' + margin.left + ',' + margin.top + ')');

	var legend = svg.append('g')
		.attr('transform','translate(' + margin.left + ',-5)')
		.attr('id','legend');

	var rotation = 0;

	//reg version//

	var yearEls = g.selectAll('.year-el')
		.data(years)
		.enter()
		.append('g')
		.attr('class','year-el')
		.attr('id', d => {return 'y-'+d.key})
		.attr('transform', (d, i) => {
			var x = 0;
			var y = i * (cHeight / years.length);

			return 'translate(' + x + ',' + y + ')';

		});

	var yearTxt = yearEls
		.append('text')
		.attr('class','label')
		.attr('transform','translate(0, 11)')
		.text(d => {return d['key']});

	var leftWidth = 100;
	var rightOffset = 50;
	var x0 = 0,
	nextWidth = cWidth - leftWidth,
	x1 = leftWidth,
	x2 = leftWidth + (nextWidth / 3) - 20,
	x3 = leftWidth + ((2*nextWidth) / 3) - rightOffset,
	legendfact = 42;

	var winwin = legend.append('text')
		.attr('transform', ' translate('+(legendfact + x0)+',' + margin.top + ')')
		.text('Won Oscar & GG');

	var winlose = legend.append('text')
		.attr('transform', 'translate('+(legendfact + x1)+',' + margin.top + ')')
		.text('Won GG, lost Oscar');

	var losewin = legend.append('text')
		.attr('transform', 'translate('+(legendfact + x2)+',' + margin.top + ') rotate('+ rotation +')')
		.text('Won Oscar, lost GG');

	var loselose = legend.append('text')
		.attr('transform', 'translate('+(legendfact + x3)+',' + margin.top + ') rotate('+ rotation +')')
		.text('Nominated for both');

	var nomsg = yearEls.selectAll('.nomgroup')
		.data(d => {return d['values']})
		.enter()
		.append('g')
		.attr('transform', e => {
			
			if (e['key'] == 'Winner YES'){
				return 'translate(' + x0 +',0)';
			}
			else if (e['key'] == 'Winner NO'){
				return 'translate(' + x1 + ',0)';
			}
			else if (e['key'] == 'Nominee YES'){
				return 'translate(' + x2 + ',0)';
			}
			else if (e['key'] == 'Nominee NO'){
				return 'translate(' + x3 + ',0)';
			}
		});

	var lines = yearEls.append('line')
		.attr('transform','translate(0,'+((cHeight / years.length) - 3) +')')
		.attr('x1', 0)
		.attr('x2', cWidth)
		.attr('y1', 0)
		.attr('y2', 0)
		.style('stroke','#ccc')
		.style('stroke-width', 1)
		.style('stroke-dasharray', '2,2');

	var noms = nomsg.selectAll('.nom')
		.data(d => {return d['values']})
		.enter()
		.append('circle')
		.attr('class','nom')
		.attr('id', (d, i) => {
			return 'circ-' + d[''];
		})
		.attr('transform',(e, j) => {
			var x1 = 50 + (j * (14 + 2)),
			x2 = 50 + (j * (10+2));
			if ((e['GLOBES WIN_x'] + ' ' + e['OSCARS WIN_y']) == 'Winner YES'){
				return 'translate(' + x1 +',10)'
			}
			else{
				return 'translate(' + x2 +',10)'
			}
		})
		.attr('r',d => {
			if ((d['GLOBES WIN_x'] + ' ' + d['OSCARS WIN_y']) == 'Winner YES'){
				return 7
			}
			else{
				return 5
			}
		})
		.attr('fill',d => {
			if ((d['GLOBES WIN_x'] + ' ' + d['OSCARS WIN_y']) == 'Winner YES'){
				return colors['yellow']['004']
			}
			else{
				return colors['black']['003']
			}
		})
		.attr('stroke','none')
		.on('mouseover',d => {return mouse(d);})
		.on('mouseout', d => {return mouseout(d);});
	//reg version//
	

	function mouse (d){
		d3.select('#circ-' + d[''])
			.attr('stroke',colors['black']['001']);

		d3.select('#tooltip')
			.style('display','block');

		d3.select('#nom-title')
			.text(d['NOM']);

		d3.select('#addtl-info')
			.text('');

		if (d['Category_y'] != 'Best Picture') {

			d3.select('#addtl-info')
				.text('(' + d['Secondary'] + ')');
		};

		d3.select('#globe-cat')
			.text(d['Category_x']);

		d3.select('#globe-win-hook')
			.text(() => {
				if (d['GLOBES WIN_x'] == 'Winner'){
					return 'Won: '
				}
				else{
					return 'Nominated for: '
				}
				
			})
			.style('color',() => {
				if (d['GLOBES WIN_x'] == 'Winner'){
					return colors['yellow']['003'];
				}
				else{
					
				}
			});

		d3.select('#osc-cat')
			.text(d['Category_y']);

		d3.select('#osc-win-hook')
			.text(() => {
				if (d['OSCARS WIN_y'] == 'YES'){
					return 'Won: '
				}
				else{
					return 'Nominated for: '
				}
				
			})
			.style('color',() => {
				if (d['OSCARS WIN_y'] == 'YES'){
					return colors['yellow']['003'];
				}
				else{
					
				}
			});
		//control for tooltip running off the page//
		var tipwidth = 180;
		var tipheight = parseInt(d3.select('#tooltip').style('height'));
		var bodyheight = parseInt(d3.select('body').style('height'));
		console.log(bodyheight);
		if (tipwidth + event.pageX + 5 <= width){
			d3.select('#tooltip')
				.style('left', event.pageX + 5 + 'px');
		}
		else {
			d3.select('#tooltip')
				.style('left', (width - tipwidth) + 'px');
		};
		if (tipheight + event.pageY + 5 <= bodyheight){
			d3.select('#tooltip')
				.style('top', event.pageY + 5 + 'px');
		}
		else{
			d3.select('#tooltip')
				.style('top', (bodyheight - tipheight) + 'px');
		}
	}
	function mouseout(d) {
		
		d3.select('#tooltip')
			.style("display",'none');

		d3.select('#circ-' + d[''])
			.attr('stroke','none');
	}
	if (width <= 400){
		
		var leftWidth = 65,
		rightOffset = 50,
		x0 = -5,
		nextWidth = cWidth - leftWidth,
		x1 = leftWidth - 7,
		x2 = leftWidth + (nextWidth / 3) - 30,
		x3 = leftWidth + 125,
		legendfact = 42;

		winwin
			.attr('transform', ' translate('+(legendfact + x0)+',' + (margin.top - 10) + ')')
			.style('font-size','10px');

		winlose
			.attr('transform', 'translate('+(legendfact + x1)+',' + (margin.top + 5) + ')')
			.style('font-size','10px');

		losewin
			.attr('transform', 'translate('+(legendfact + x2)+',' + (margin.top -10) + ')')
			.style('font-size','10px');

		loselose
			.attr('transform', 'translate('+cWidth+',' + (margin.top + 5) + ')')
			.style('text-anchor','end')
			.style('font-size','10px');

		nomsg
			.attr('transform', e => {
			
				if (e['key'] == 'Winner YES'){
					return 'translate(' + x0 +',0)';
				}
				else if (e['key'] == 'Winner NO'){
					return 'translate(' + x1 + ',0)';
				}
				else if (e['key'] == 'Nominee YES'){
					return 'translate(' + x2 + ',0)';
				}
				else if (e['key'] == 'Nominee NO'){
					return 'translate(' + cWidth + ',0)';
				}
		});
		noms
			.attr('transform',(e, j) => {
				var x1 = 50 + (j * (14 + 2)),
				x2 = 50 + (j * (9+2));
				if ((e['GLOBES WIN_x'] + ' ' + e['OSCARS WIN_y']) == 'Winner YES'){
					return 'translate(' + x1 +',10)'
				}
				else if ((e['GLOBES WIN_x'] + ' ' + e['OSCARS WIN_y']) == 'Nominee NO'){
					return 'translate('+ (-x2 + 50) + ',10)';
				}
				else{
					return 'translate(' + x2 +',10)'
				}
			})
			.attr('r',d => {
				if ((d['GLOBES WIN_x'] + ' ' + d['OSCARS WIN_y']) == 'Winner YES'){
					return 7
				}
				else{
					return 4.5
				}
			})
	}
		
};

export default draw;
