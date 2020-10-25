import * as d3 from 'd3';
import * as topojson from 'topojson-client';

export default function HeatMap(data) {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const height = (width * 2) / 3;
  const projection = d3.geoAlbersUsa().fitWidth();
  const path = d3.geoPath();
  const format = d3.format('d');

  const color = d3.scaleSequential([0, 1500], d3.interpolateYlGn);

  const svg = d3
    .select('#map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg.append('g');

  d3.json(
    'https://cdn.jsdelivr.net/npm/us-atlas@3.0.0/counties-albers-10m.json'
  ).then(function (us) {
    console.log(us);
    g.selectAll('path')
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append('path')
      .attr('fill', (d) => color(data.get(d.id)))
      .attr('d', path);

    svg
      .append('path')
      .datum(topojson.mesh(us, us.objects.counties, (a, b) => a !== b))
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr('d', path);
  });
  return svg.node();
}
