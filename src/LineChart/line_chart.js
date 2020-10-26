import * as d3 from 'd3';

const margin = { top: 25, right: 50, bottom: 50, left: 50 };
let screenWidth = 800;
let chartHeight = (screenWidth * 2) / 3;
let width = screenWidth - margin.left - margin.right;
let height = chartHeight - margin.top - margin.bottom;

let _containerId = '';
let _options = {};
let _svg;
let _x;
let _y;
let _xAxis;
let _initialXDomain;

const calculateDimensions = () => {
  screenWidth = document.querySelector(`#${_containerId}`).clientWidth;
  chartHeight = Math.min(window.innerHeight - 110 , (screenWidth * 2) / 3);

  width = screenWidth - margin.left - margin.right;
  height = chartHeight - margin.top - margin.bottom;
};

const redrawing = () => {
  initLineChart(_containerId, _options);
  createLineChart(_options);
};

// Hacktoberfest: Update this function to animate the data change instead of redrawing the chart each time
window.addEventListener('resize', redrawing);

export const initLineChart = (containerId, options) => {
  // Set for params on redrawing
  _containerId = containerId;
  _options = options;
  calculateDimensions();

  // Remove old svg if found
  d3.select(`#${containerId} svg`).remove();

  const svg = d3
    .select(`#${containerId}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('id', 'main');

  // Initialize X and Y axis
  const x = d3.scaleTime().range([0, width]);
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'xAxis')
    .attr('transform', `translate(0,${height})`);

  const y = d3.scaleLinear().range([height, 0]);
  svg.append('g').attr('class', 'yAxis');

  svg.append('line').attr('class', 'axis sideXAxis');
  svg.append('line').attr('class', 'axis sideYAxis');

  options.lines.forEach((line, i) => {
    svg
      .append('path')
      .attr('class', `${options.lineMap[line.property]} data-line`);
  });

  svg.append('g').attr('class', 'additional-axis');

  // Add brushing
  // Create the line variable: where both the line and the brush take place
  const line = svg.append('g').attr('clip-path', 'url(#clip)');

  const brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on('end', () => {
      const selection = d3.event.selection;
      if (selection) {
        const domain = [_x.invert(selection[0]), _x.invert(selection[1])];
        options.updateConfig({ domain });
        line.select('.brush').call(brush.move, null);
      }
    });

  // Add the brushing
  line.append('g').attr('class', 'brush').call(brush);

  svg.on('dblclick', function () {
    options.updateConfig({ domain: null });
  });

  if (options.area) {
    // Add area fill
    svg
      .append('path')
      .attr('class', `${options.lineMap[options.area.property]}-area area`);
    // add lines for area
    svg
      .append('line')
      .attr(
        'class',
        `${options.lineMap[options.area.property]}-area-line area-line left`
      );
    svg
      .append('line')
      .attr(
        'class',
        `${options.lineMap[options.area.property]}-area-line area-line bottom`
      );

    // Hacktoberfest Issue: make gradient customizable (Hint: you can add the vars to the options.area variable)
    // add gradient to svg
    svg
      .append('linearGradient')
      .attr('id', 'temperature-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');
  }
  _svg = svg;
  _x = x;
  _y = y;
};
/**
 * Create a line chart
 * @param  {Object} options key value pair of chart controls TODO: Add documentation of whats inside
 */
export const createLineChart = async (options) => {
  const numYTicks = 6;
  const animationDuration = 1000;
  const svg = _svg;
  const x = _x;
  const y = _y;

  // Set for params on redrawing
  _options = options;

  // Use same name for lines and update data for params to trigger chart update
  const filteredData = options.data.map((item) => {
    const newObj = { date: item.date, cases: item.cases };
    options.lines.forEach(
      (line) => (newObj[options.lineMap[line.property]] = item[line.property])
    );
    return newObj;
  });
  const numPoints = filteredData.length;

  // Find start date and end date for X
  const firstDay = filteredData[0]?.date;
  const lastDay = filteredData[numPoints - 1]?.date;
  const numMonths = Math.abs(firstDay.getMonth() - lastDay.getMonth()) + 1;

  // Find the max values for Y
  const maxCases = d3.max(filteredData, (d) =>
    Number(d[options.lineMap[options.yProperty]])
  );
  const maxY = Math.round(maxCases + maxCases * 0.1);

  // Create our scales
  _initialXDomain = [firstDay, lastDay];
  const xScale = x.domain([firstDay, lastDay]);
  const yScale = y.domain([0, maxY]);

  // Generate the lines
  const lines = options.lines.map((l) =>
    d3
      .line()
      .x((d) => xScale(new Date(d.date)))
      .y((d) => yScale(d[options.lineMap[l.property]]))
  );

  // Hacktoberfest Issue: and ability from options param to add custom class (hint use current class as a default)

  // Set up axis ticks
  // X Axis
  _xAxis = svg
    .selectAll('.xAxis')
    .transition()
    .duration(animationDuration)
    .call(
      d3
        .axisBottom(xScale)
        .tickFormat((t) => d3.timeFormat(numMonths > 3 ? '%b' : '%b %d')(t))
        .tickSize(0)
        .ticks(numMonths < 3 ? 8 : numMonths) // http://www.d3noob.org/2016/08/changing-number-of-ticks-on-axis-in.html
    )
    .selectAll('text')
    .attr('stroke', 'none')
    .attr('y', 10)
    .selectAll('text')
    .attr('stroke', 'none')
    .attr('y', 10);

  // Y Axis
  const yAxis = svg
    .selectAll('.yAxis')
    .transition()
    .duration(animationDuration)
    .call(d3.axisLeft(yScale).tickSize(0).ticks(numYTicks, 's'));

  yAxis.select('path').attr('class', 'axis');

  yAxis.selectAll('text').attr('x', -10).attr('y', -4);

  // Add closing boxes around chart
  // Hacktoberfest Issue: add a custom class using the options variable (Hint look for other examples)
  svg
    .select('.sideXAxis')
    .attr('x1', xScale(firstDay))
    .attr('y1', yScale(maxY))
    .attr('x2', xScale(lastDay)); // Top Horizontal Line

  svg
    .select('.sideYAxis')
    .attr('y1', yScale(0))
    .attr('x1', xScale(lastDay))
    .attr('y2', yScale(maxY))
    .attr('x2', xScale(lastDay)); // Right Vertical Line

  // Get all additional axis lines and set with data
  const u = svg
    .select('.additional-axis')
    .selectAll('line')
    .data(yScale.ticks(numYTicks));

  // Add new axis
  u.enter()
    .append('line')
    .attr('class', 'axis')
    .merge(u)
    .transition()
    .duration(animationDuration)
    .attr('y1', (d, i) => yScale(d))
    .attr('x1', xScale(firstDay))
    .attr('x2', xScale(lastDay))
    .attr('y2', (d, i) => yScale(d));

  // Remove old axis
  u.exit()
    .transition()
    .duration(animationDuration)
    .style('opacity', 0)
    .remove();

  // Add chart data lines
  options.lines.forEach((line, i) => {
    svg
      .select(`.${options.lineMap[line.property]}`)
      .datum(filteredData)
      .transition()
      .duration(animationDuration)
      .attr('d', lines[i]);
  });

  if (options.area) {
    // Add area fill
    svg
      .selectAll(`.${options.lineMap[options.area.property]}-area`)
      .datum(filteredData)
      .transition()
      .duration(animationDuration)
      .attr(
        'd',
        d3
          .area()
          .x((d) => xScale(new Date(d.date)))
          .y0(yScale(0))
          .y1((d) => yScale(d[options.lineMap[options.area.property]]))
      );
    // add lines for area
    svg
      .select(`.${options.lineMap[options.area.property]}-area-line.bottom`)
      .attr('x1', xScale(firstDay))
      .attr('y1', yScale(0))
      .attr('x2', xScale(lastDay))
      .attr('y2', yScale(0));

    svg
      .select(`.${options.lineMap[options.area.property]}-area-line.left`)
      .attr('x1', xScale(lastDay))
      .attr('y1', yScale(0))
      .attr('x2', xScale(lastDay))
      .attr(
        'y2',
        yScale(
          options.accum
            ? maxCases
            : filteredData[numPoints - 1][
                options.lineMap[options.area.property]
              ]
        )
      );

    // Hacktoberfest Issue: make gradient customizable (Hint: you can add the vars to the options.area variable)
    // add gradient to svg
    svg
      .select(`#temperature-gradient`)
      .attr('x1', 0)
      .attr('y1', yScale(0))
      .attr('x2', 0)
      .attr('y2', yScale(maxCases))
      .selectAll('stop')
      .data([
        { offset: '0%', color: 'transparent' },
        { offset: '50%', color: 'green' },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);
  }
};
