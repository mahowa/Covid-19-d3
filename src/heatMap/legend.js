import * as d3 from 'd3';

export default function legend(data, svg, width) {
  const scaleHeight = 30;
  const scaleWidth = 300;

  const colorScale = d3
    .scaleSequential(d3.interpolateRdPu)
    .domain([...data.values()]);

  const extent = d3.extent([...data.values()]);
  const defs = svg.append('defs');
  console.log(extent);

  const legendGroup = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${20})`);

  const title = legendGroup
    .append('text')
    .attr('y', 25)
    .attr('class', 'title')
    .style('fill', 'white')
    .style('font-size', '25px')
    .text('COVID 19 cases per day');

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

  const xScale = d3.scaleLinear().domain(extent).range([0, scaleWidth]).nice();

  let legendGenerator = d3.axisBottom(xScale);

  legendGenerator.ticks(4);

  let xAxis = legendGroup
    .append('g')
    .attr('transform', `translate(0, ${-scaleHeight})`)
    .call(legendGenerator);

  return legendGradient.node();
}
