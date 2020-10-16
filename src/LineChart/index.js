import { createLineChart } from "./line_chart";
import { addContainer } from "../d3helpers";
import { createCheckBox, createSelectBox } from "../filters";

// Default chart config
var lineChartOptions = {
  yProperty: "cases",
  lines: [
    {
      property: "cases"
    },
    {
      property: "deaths"
    }
  ],
  area: { property: "cases" }
};

var lineChartConfig = {
  state: "Alabama", // HacktoberFest Issue: would be cool if we got the users location and set this to default
  accum: false
};

const build = (data) => {
  const chartId = "line-chart";
  const buildChart = () => {
    const states = data.states[lineChartConfig.state];

    const accum = lineChartConfig.accum;
    lineChartOptions.yProperty = accum ? "cases_accum" : "cases";
    lineChartOptions.lines[0].property = accum ? "cases_accum" : "cases";
    lineChartOptions.lines[1].property = accum ? "deaths_accum" : "deaths";
    lineChartOptions.area.property = accum ? "cases_accum" : "cases";

    createLineChart(chartId, {
      data: states,
      ...lineChartOptions,
      ...lineChartConfig
    });
  };

  const updateConfig = (option) => {
    if (!option) return;
    const [key, value] = Object.entries(option)[0];
    lineChartConfig[key] = value;
    buildChart();
  };

  addContainer(chartId);
  createSelectBox(
    chartId,
    "state",
    Object.keys(data.states).sort(),
    updateConfig
  );

  createCheckBox(chartId, "accum", "Show Cumulative", updateConfig);

  // Hacktoberfest issue: create a time selection control

  buildChart();
};

export default build;
