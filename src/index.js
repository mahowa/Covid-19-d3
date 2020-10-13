//
//  Datasets: https://github.com/nytimes/covid-19-data/tree/master/live
//
//
//

import * as d3 from "d3";

const screenWidth = window.innerWidth;
const chartHeight = (screenWidth * 2) / 3;
const numYTicks = 6;

const margin = { top: 50, right: 50, bottom: 50, left: 50 },
  width = screenWidth - margin.left - margin.right,
  height = chartHeight - margin.top - margin.bottom;

const createChart = async (state = "Alabama", accum = true) => {
  // Remove old svg if found
  d3.select("svg").remove();

  const data = await d3.csv(
    "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv"
  );
  console.log({ data });
  let filteredData = data.filter((d) => d.state === state);

  // Manipulate data if accumulative data is not selected
  if (!accum) {
    let totalCases = Number(filteredData[0]?.cases || 0);
    let totalDeaths = Number(filteredData[0]?.deaths || 0);

    filteredData = filteredData.map((d, i) => {
      if (i === 0) return d;
      const current = { ...d };
      current.cases = Number(current.cases) - totalCases;
      current.deaths = Math.max(Number(current.deaths) - totalDeaths, 0);
      totalCases += current.cases;
      totalDeaths += current.deaths;
      return current;
    });
  }

  const numPoints = filteredData.length;

  //Find start date and end date for X
  const firstDay = new Date(filteredData[0]?.date);
  const lastDay = new Date(filteredData[numPoints - 1]?.date);
  const numMonths = Math.abs(firstDay.getMonth() - lastDay.getMonth()) + 1;
  console.log(firstDay, lastDay);

  //Find the max values for Y
  const maxCases = d3.max(filteredData, (d) => Number(d.cases));
  const maxY = Math.round(maxCases + maxCases * 0.1); //Buffer the top by 10% to give the chart some room
  console.log(maxCases);

  // Create our scales
  const xScale = d3.scaleTime().domain([firstDay, lastDay]).range([0, width]);

  const yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0]);

  //Generate the lines
  const line1 = d3
    .line()
    .x((d) => xScale(new Date(d.date)))
    .y((d) => yScale(d.cases));

  const line2 = d3
    .line()
    .x((d) => xScale(new Date(d.date)))
    .y((d) => yScale(d.deaths));

  // Set up svg
  const svg = d3
    .select("#line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Set up axis
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

  const yAxis = svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(0).ticks(numYTicks, "s"));

  yAxis.select("path").attr("class", "axis");

  yAxis.selectAll("text").attr("x", -10).attr("y", -4);

  // Add lines to box in chart
  svg
    .append("line")
    .attr("class", "axis")
    .attr("x1", xScale(firstDay))
    .attr("y1", yScale(maxY))
    .attr("x2", xScale(lastDay));

  svg
    .append("line")
    .attr("class", "axis")
    .attr("y1", yScale(0))
    .attr("x1", xScale(lastDay))
    .attr("y2", yScale(maxY))
    .attr("x2", xScale(lastDay));

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

  // Add the deaths line path to the svg
  svg
    .append("path")
    .datum(filteredData)
    .attr("class", "line2")
    .attr("d", line2);

  // Add area fill
  svg
    .append("path")
    .datum(filteredData)
    .attr("class", "area")
    .attr(
      "d",
      d3
        .area()
        .x((d) => xScale(new Date(d.date)))
        .y0(yScale(0))
        .y1((d) => yScale(d.cases))
    );

  // Add the cases line path to the svg
  svg.append("path").datum(filteredData).attr("class", "line").attr("d", line1);

  // add lines for area
  svg
    .append("line")
    .attr("class", "line")
    .attr("x1", xScale(firstDay))
    .attr("y1", yScale(0))
    .attr("x2", xScale(lastDay))
    .attr("y2", yScale(0));

  svg
    .append("line")
    .attr("class", "line")
    .attr("x1", xScale(lastDay))
    .attr("y1", yScale(0))
    .attr("x2", xScale(lastDay))
    .attr(
      "y2",
      accum ? yScale(maxCases) : yScale(filteredData[numPoints - 1].cases)
    );

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
};

createChart();

const states = [
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Federated States of Micronesia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Marshall Islands",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Mariana Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Island",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];

// Create select box
const select = d3
  .select("#line-chart")
  .append("select")
  .attr("class", "select")
  .attr("value", "Utah")
  // .property("selected", d=> d === "Utah") TODO figure out how to make this work
  .on("change", () => {
    const val = d3.select("select").property("value");
    const accum = d3.select("input").property("checked");
    createChart(val, accum);
  });

select
  .selectAll("option")
  .data(states)
  .enter()
  .append("option")
  .text((d) => d);

// Create check box
d3.select("#line-chart")
  .append("label")
  .text("Accumulative")
  .append("input")
  .attr("type", "checkbox")
  .attr("checked", true)
  .on("change", () => {
    const val = d3.select("select").property("value");
    const accum = d3.select("input").property("checked");
    createChart(val, accum);
  });
