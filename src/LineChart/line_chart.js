import * as d3 from "d3";

// Hacktoberfest Issue: make the chart responsive (full screen but resizes with the window)

let screenWidth = window.innerWidth;
let chartHeight = (screenWidth * 2) / 3;
const numYTicks = 6;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };
let width = screenWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;

let _containerId = '', _options = {};

const redrawing = () => {
  screenWidth = window.innerWidth;
  chartHeight = (screenWidth * 2) / 3;

  width = screenWidth - margin.left - margin.right;
  height = chartHeight - margin.top - margin.bottom;

  createLineChart(_containerId, _options, false);
}

// Hacktoberfest: Update this function to animate the data change instead of redrawing the chart each time
window.addEventListener("resize", redrawing);

/**
 * Create a line chart
 * @param  {string} containerId the id of the container to draw in;
 * @param  {Object} options key value pair of chart controls TODO: Add documentation of whats inside
 */
export const createLineChart = async (containerId, options, init = true) => {
  // Set for params on redrawing
  _containerId = containerId;
  _options = options;

  const id = `#${containerId}`;
  // Remove old svg if found
  d3.select(`${id} svg`).remove();

  const filteredData = options.data;
  const numPoints = filteredData.length;

  // Find start date and end date for X
  const firstDay = filteredData[0]?.date;
  const lastDay = filteredData[numPoints - 1]?.date;
  const numMonths = Math.abs(firstDay.getMonth() - lastDay.getMonth()) + 1;

  // Find the max values for Y
  const maxCases = d3.max(filteredData, (d) => Number(d[options.yProperty]));
  const maxY = Math.round(maxCases + maxCases * 0.1);

  // Create our scales
  const xScale = d3.scaleTime().domain([firstDay, lastDay]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0]);

  // Generate the lines
  const lines = options.lines.map((l) =>
    d3
      .line()
      .x((d) => xScale(new Date(d.date)))
      .y((d) => yScale(d[l.property]))
  );

  // Set up svg
  const svg = d3
    .select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Hacktoberfest Issue: and ability from options param to add custom class (hint use current class as a default)

  // Set up axis
  // X Axis
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickFormat((t) => d3.timeFormat("%B")(t))
        .tickSize(0)
        .ticks(numMonths) // todo figure out why this isnt working the way we want
    )
    .selectAll("text")
    .attr("stroke", "none")
    .attr("y", 10)
    .selectAll("text")
    .attr("stroke", "none")
    .attr("y", 10);

  // Y Axis
  const yAxis = svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(0).ticks(numYTicks, "s"));

  yAxis.select("path").attr("class", "axis");

  yAxis.selectAll("text").attr("x", -10).attr("y", -4);

  // Add closing boxes around chart
  // Hacktoberfest Issue: add a custom class using the options variable (Hint look for other examples)
  svg
    .append("line")
    .attr("class", "axis")
    .attr("x1", xScale(firstDay))
    .attr("y1", yScale(maxY))
    .attr("x2", xScale(lastDay)); // Top Horizontal Line

  svg
    .append("line")
    .attr("class", "axis")
    .attr("y1", yScale(0))
    .attr("x1", xScale(lastDay))
    .attr("y2", yScale(maxY))
    .attr("x2", xScale(lastDay)); // Right Vertical Line

  svg
    .append("g")
    .selectAll("line")
    .data(yScale.ticks(numYTicks))
    .enter()
    .append("line")
    .attr("class", "axis")
    .attr("y1", (d, i) => yScale(d))
    .attr("x1", xScale(firstDay))
    .attr("x2", xScale(lastDay))
    .attr("y2", (d, i) => yScale(d));

  // Add line paths to svg
  options.lines.forEach((line, i) => {
    const path = svg
      .append("path")
      .datum(filteredData)
      .attr("class", `${line.property} data-line`)
      .attr("d", lines[i]);

      // Add animate
      const totalLength = path.node().getTotalLength();
      if (init)
        path
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
  });

  if (options.area) {
    // Add area fill
    svg
      .append("path")
      .datum(filteredData)
      .attr("class", `${options.area.property}-area area`)
      .attr(
        "d",
        d3
          .area()
          .x((d) => xScale(new Date(d.date)))
          .y0(yScale(0))
          .y1((d) => yScale(d[options.area.property]))
      );
    // add lines for area
    const horizontalLine = svg
      .append("line")
      .attr("class", `${options.area.property}-area-line area-line`)
      .attr("x1", xScale(firstDay))
      .attr("y1", yScale(0))
      .attr("x2", xScale(lastDay))
      .attr("y2", yScale(0));

    const verticalLine = svg
      .append("line")
      .attr("class", `${options.area.property}-area-line area-line`)
      .attr("x1", xScale(lastDay))
      .attr("y1", yScale(0))
      .attr("x2", xScale(lastDay))
      .attr(
        "y2",
        options.accum
          ? yScale(maxCases)
          : yScale(filteredData[numPoints - 1].cases)
      );
      
      // Add animate
      const horizontalTotalLength = horizontalLine.node().getTotalLength();
      const verticalTotalLength = verticalLine.node().getTotalLength();
      if (init) {
        horizontalLine
          .attr("stroke-dasharray", horizontalTotalLength + " " + horizontalTotalLength)
          .attr("stroke-dashoffset", horizontalTotalLength)
          .transition()
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);

        verticalLine
          .attr("stroke-dasharray", verticalTotalLength + " " + verticalTotalLength)
          .attr("stroke-dashoffset", verticalTotalLength)
          .transition()
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      }

    // Hacktoberfest Issue: make gradient customizable (Hint: you can add the vars to the options.area variable)
    // add gradient to svg
    svg
      .append("linearGradient")
      .attr("id", "temperature-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", yScale(0))
      .attr("x2", 0)
      .attr("y2", yScale(maxCases))
      .selectAll("stop")
      .data([
        { offset: "0%", color: "transparent" },
        { offset: "50%", color: "green" }
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);
  }
};
