//API to fetch historical data of Bitcoin Price Index
const api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2019-12-31&end=2020-04-01';

/**
 * Loading data from API when DOM Content has been loaded'.
 */
document.addEventListener('DOMContentLoaded', (event) => {
	fetch(api)
		.then((response) => response.json())
		.then((data) => {
			let parsedData = parseData(data);
			drawChart(parsedData);
		})
		.catch((err) => console.log(err));
});

/**
 * Parse data into key-value pairs
 * @param {object} data Object containing historical data of BPI
 */
parseData = (data) => {
	let arr = [];
	for (let i in data.bpi) {
		arr.push({
			date: new Date(i), //date
			value: +data.bpi[i] //convert string to number
		});
	}
	return arr;
};

/**
 * Creates a chart using D3
 * @param {object} data Object containing historical data of BPI
 */
drawChart = (data) => {
	let svgWidth = 600,
		svgHeight = 400;
	let margin = { top: 20, right: 20, bottom: 30, left: 50 };
	let width = svgWidth - margin.left - margin.right;
	let height = svgHeight - margin.top - margin.bottom;

	let svg = d3.select('svg').attr('width', svgWidth).attr('height', svgHeight);

	let g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	let x = d3.scaleTime().rangeRound([0, width]);

	let y = d3.scaleLinear().rangeRound([height, 0]);

	let line = d3
		.line()
		.x((d) => x(d.date))
		.y((d) => y(d.value));
	x.domain(d3.extent(data, (d) => d.date));
	y.domain(d3.extent(data, (d) => d.value));

	g.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x))
		.select('.domain')
		.remove();

	g.append('g')
		.call(d3.axisLeft(y))
		.append('text')
		.attr('fill', '#000')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.attr('text-anchor', 'end')
		.text('Price ($)');

	g.append('path')
		.datum(data)
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-linejoin', 'round')
		.attr('stroke-linecap', 'round')
		.attr('stroke-width', 1.5)
		.attr('d', line);
};
