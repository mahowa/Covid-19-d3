import * as d3 from 'd3';
import * as topojson from 'topojson-client';
// import legend from './legend'

// Hacktoberfest: Update this function to animate the data change instead of redrawing the chart each time
function responsivefy(svg) {
  // container will be the DOM element the svg is appended to
  // we then measure the container and find its aspect ratio
  const container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style('width'), 10),
    height = parseInt(svg.style('height'), 10),
    aspect = width / height;

  // add viewBox attribute and set its value to the initial size
  // add preserveAspectRatio attribute to specify how to scale
  // and call resize so that svg resizes on inital page load
  svg
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMid')
    .call(resize);

  // add a listener so the chart will be resized when the window resizes
  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on('resize.' + container.attr('id'), resize);

  // this is the code that actually resizes the chart
  // and will be called on load and in response to window resize
  // gets the width of the container and proportionally resizes the svg to fit
  function resize() {
    const targetWidth = parseInt(container.style('width'));
    svg.attr('width', targetWidth);
    svg.attr('height', Math.round(targetWidth / aspect));
  }
}

export default function HeatMap(data) {
  const margin = { top: 25, right: 10, bottom: 50, left: 10 };
  let width = 0;
  let height = 0;
  let y;
  let x;
  let scaleHeight = 30;
  let scaleWidth = 300;

  const screenWidth = document.querySelector('#map').clientWidth;
  const chartHeight = screenWidth / 2;

  width = screenWidth - margin.left - margin.right;
  height = chartHeight - margin.top - margin.bottom;

  const path = d3.geoPath();
  const format = d3.format('d');

  const projection = d3
    .geoAlbersUsa()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale(700);

  const color = d3.scaleSequentialQuantile(
    [...data.values()],
    d3.interpolateRdPu
  );
  const svg = d3
    .select('#map')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .call(responsivefy) // this is all it takes to make the chart responsive
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const g = svg.append('g');

  svg
    .append('text')
    .attr('transform', 'translate(0 ,0)')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('class', 'title')
    .style('fill', 'white')
    .style('font-size', '25px')
    .text('COVID 19 US cases per day');

  d3.json(
    'https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/counties-albers-10m.json'
  ).then(function (us) {
    console.log(us);
    g.selectAll('path')
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', (d) => color(data.get(d.id)));

    svg
      .append('path')
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr('d', path);

    const colorScale = d3
      .scaleSequential(d3.interpolateRdPu)
      .domain([...data.values()]);

    const defs = svg.append('defs');

    const numberOfGradientStops = 10;
    const stops = d3
      .range(numberOfGradientStops)
      .map((i) => i / (numberOfGradientStops - 1));
    const legendGradientId = 'legend-gradient';
    const gradient = defs
      .append('linearGradient')
      .attr('id', legendGradientId)
      .selectAll('stop')
      .data(stops)
      .enter()
      .append('stop')
      .attr('stop-color', (d) => d3.interpolateRdPu(d))
      .attr('offset', (d) => `${d * 100}%`);

    const legendGradient = svg
      .append('rect')
      .attr('transform', `translate(${width / 2} ,-40)`)
      .attr('height', scaleHeight)
      .attr('width', scaleWidth)

      .style('fill', `url(#${legendGradientId})`);
  });

  return svg.node();
}
