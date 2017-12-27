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
	
	var years = d3.nest().key(d => {return d['Year'];}).key(d => {return d['GLOBES WIN_x'] + ' ' + d['OSCARS WIN_y']}).entries(Globes);
	years.sort((x, y) => {
		return d3.descending(+x.key, +y.key);
	});
	
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
	var margin = {top: 60, left: 10, right:10, bottom: 10};
	var cWidth = width - margin.left - margin.right;
	var cHeight = height - margin.top - margin.bottom;
	var svg = container.append('svg')
		.attr('width',width)
		.attr('height',height);

	var tooltip = d3.select('body').append('div')
		.attr('id','tooltip')
		.html('<p id="nom-title"></p>'+
			'<p id="cat"></p>' + 
			'<p id="addtl-info"></p>'
			)
		.style('display','none')
		.style('position','absolute');

	var g = svg.append('g')
		.attr('transform','translate(' + margin.left + ',' + margin.top + ')');

	var legend = svg.append('g')
		.attr('id','legend');

	var rotation = -30;

	legend.append('text')
		.attr('transform', ' translate(50,' + margin.top + ') rotate('+ rotation +')')
		.text('Won Oscar & GG');

	legend.append('text')
		.attr('transform', 'translate(140,' + margin.top + ') rotate('+ rotation +')')
		.text('Won GG, lost Oscar');

	legend.append('text')
		.attr('transform', 'translate(300,' + margin.top + ') rotate('+ rotation +')')
		.text('Won Oscar, lost GG');

	legend.append('text')
		.attr('transform', 'translate(450,' + margin.top + ') rotate('+ rotation +')')
		.text('Nominated for both');
		/*
	var yearEls = g.selectAll('.year-el')
		.data(years)
		.enter()
		.append('g')
		.attr('class','year-el')
		.attr('id', d => {return 'y-'+d.key})
		.attr('transform', (d, i) => {
			var x = 0;
			var y = i * (120);

			return 'translate(' + x + ',' + y + ')';

		});

	var yearTxt = yearEls
		.append('text')
		.attr('class','label')
		.attr('transform','translate(0, 60)')
		.text(d => {return d['key']});

	var nomsg = yearEls.selectAll('.nomgroup')
		.data(d => {return d['values']})
		.enter()
		.append('g');

	var pie = d3.pie()
		.sort(null)
		.value

	var nomnoms = nomsg.selectAll('.losers')
		.data(d => {return d['values']})
		.enter()
		.append('circle')
		.attr('r', 4)
		.attr('transform', (d, i) => {
			var x = i * (8 + 1);
			var y = 60;

			return 'translate('+ x + ',' + y + ')';
		})
		.attr('fill',colors['blue']['004']);
		*/
	//dreams version//

	//dreams version end//
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

	var rightOffset = 60;

	var nomsg = yearEls.selectAll('.nomgroup')
		.data(d => {return d['values']})
		.enter()
		.append('g')
		.attr('transform', e => {
			var x0 = 0,
			x1 = (cWidth / 4) - rightOffset,
			x2 = (cWidth /2) - rightOffset,
			x3 = ((3*cWidth) / 4) - rightOffset;
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

	var noms = nomsg.selectAll('.nom')
		.data(d => {return d['values']})
		.enter()
		.append('circle')
		.attr('class','nom')
		.attr('transform',(e, j) => {
			var x1 = 50 + (j * (12 + 1)),
			x2 = 50 + (j * (8+1));
			if ((e['GLOBES WIN_x'] + ' ' + e['OSCARS WIN_y']) == 'Winner YES'){
				return 'translate(' + x1 +',10)'
			}
			else{
				return 'translate(' + x2 +',10)'
			}
		})
		.attr('r',d => {
			if ((d['GLOBES WIN_x'] + ' ' + d['OSCARS WIN_y']) == 'Winner YES'){
				return 6
			}
			else{
				return 4
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
		.attr('stroke',d => {
			if ((d['GLOBES WIN_x'] + ' ' + d['OSCARS WIN_y']) == 'Winner YES'){
				return colors['yellow']['004']
			}
			else{
				return colors['black']['003']
			}
		})
		.attr('stroke-width',1.5)
		.on('mouseover',d => {return mouse(d);});
	//reg version//
	

	function mouse (d){
		console.log(MouseEvent.pageX)
		d3.select('#tooltip')
			.style('display','block');

		d3.select('#nom-title')
			.text(d['NOM']);

		d3.select('#tooltip')
			.style('left', event.clientX + 5 + 'px')
			.style('top', event.clientY + 5 + 'px');
	}

		
};

export default draw;
