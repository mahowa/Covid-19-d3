import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const width = 900;
const height = 600;
// eslint-disable-next-line no-unused-vars
const div = document.getElementById('#map');
const svg = d3
  .select('#map')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid')
  .attr('viewBox', `0 0 ${width} ${height}`);

export default function HeatMap() {
  svg.attr('width', width).attr('height', height);

  // eslint-disable-next-line no-unused-vars
  const projection = d3.geoAlbersUsa().scale(700);

  const path = d3.geoPath();

  const g = svg.append('g');

  d3.json(
    'https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/counties-albers-10m.json'
  ).then(function (topology) {
    g.selectAll('path')
      .data(topojson.feature(topology, topology.objects.counties).features)
      .enter()
      .append('path')
      .attr('d', path);

    g.append('path')
      .datum(
        topojson.mesh(topology),
        topology.objects.states,
        (a, b) => a !== b
      )
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr('d', path);
  });
}
