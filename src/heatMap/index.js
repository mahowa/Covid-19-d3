import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import legend from './legend';

function responsivefy(svg) {
  // container will be the DOM element the svg is appended to
  // we then measure the container and find its aspect ratio
  const container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style('width'), 10),
    height = parseInt(svg.style('height'), 10),
    aspect = width / height;

  svg
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMid')
    .call(resize);

  d3.select(window).on('resize.' + container.attr('id'), resize);

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

  const screenWidth = document.querySelector('#map').clientWidth;
  const chartHeight = screenWidth / 2;

  width = screenWidth - margin.left - margin.right;
  height = chartHeight;

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

    legend(data, svg, width);
  });

  return svg.node();
}
