import * as d3 from 'd3';

/**
 * Get the total cases over a period of time. NOTE: add keys to object to get other totals. eg deaths
 * @param  {Object[]} data filtered state data over a period of time
 */
const getTotals = (data) => data.reduce((res, day) => 
    ({cases: res.cases + day.cases,}),
    { cases: 0 }
  );


/**
 * Init summary table before chart initialization
 * @param  {string} containerId id of chart
 */
export const initSummaryTable = (containerId) => {
  const id = `#${containerId}`;
  const table = d3.select(id).append('table').attr('class', 'summary-table');
};

const abbreviateNumber = (value) => d3.format(".3s")(value);

const formatNumberWithCommas = (value) => d3.format(",r")(value);

/**
 * Create a summary table for a chart
 * @param  {string} containerId id of chart
 * @param  {Object[]} data filtered state data
 */
export const createSummaryTable = (containerId, data) => {
  const id = `#${containerId}`;

  d3.select(`${id} .summary-table`).html('');

  const numPoints = data.length;
  const lastDay = data[numPoints - 1].date.getDay();
  const lastWeekInitialIndex = numPoints - lastDay - 8;
  const currentWeekInitialIndex = numPoints - lastDay - 1;
  const lastWeek = data.slice(lastWeekInitialIndex, currentWeekInitialIndex);
  const currentWeek = data.slice(currentWeekInitialIndex);
  const lastWeekTotals = getTotals(lastWeek);
  const currentWeekTotals = getTotals(currentWeek);

  const summary = {
    totalCases: {
      label: 'total cases',
      value: data[numPoints - 1].cases_accum,
    },
    totalDeaths: {
      label: 'total deaths',
      value: data[numPoints - 1].deaths_accum,
    },
    lastWeekCases: {
      label: 'last week cases',
      value: lastWeekTotals.cases,
    },
    currentWeek: {
      label: 'current week cases',
      value: currentWeekTotals.cases,
    },
  };

  const table = d3.select('.summary-table');
  const head = table.append('thead').append('tr');
  const body = table.append('tbody').append('tr');

  for (let key in summary) {
    head
      .append('th')
      .text(summary[key].label)
      .attr('width', 150)
      .attr('class', 'summary-table_cell');
    body
      .append('td')
      .text(abbreviateNumber(summary[key].value))
      .attr('data-title', formatNumberWithCommas(summary[key].value))
      .attr('width', 150)
      .attr('class', 'summary-table_cell');
  }
};

