import * as d3 from 'd3';

/**
 * Create a checkbox for a chart
 * @param  {string} containerId
 * @param  {string} property the chart property you are updating
 * @param  {string} text
 * @param  {function} onChange callback that returns
 * @param  {string} labelClass custom select class. Defaults to 'cv19label'
 * @param  {string} inputClass custom select class. Defaults to 'cv19inpute'
 */
export const createCheckBox = (
  containerId,
  property,
  text,
  onChange,
  labelClass = 'cv19label',
  inputClass = 'cv19input'
) => {
  const id = `${containerId}_${property}_checkbox`;
  d3.select(`#${containerId}`)
    .append('label')
    .attr('class', labelClass)
    .text(text)
    .append('input')
    .attr('type', 'checkbox')
    .attr('id', id)
    .property('checked', false)
    .attr('class', inputClass)
    .on('change', () => {
      const val = d3.select(`#${id}`).property('checked');
      onChange({ [property]: val });
    });
};

/**
 * Create a selectbox for a chart
 * @param  {string} containerId id of chart NOTE: 1 select per container
 * @param  {string} property the chart property you are updating
 * @param  {string} options select options
 * @param  {function} onChange callback that returns
 * @param  {string} selectClass custom select class. Defaults to 'cv19select'
 * @param  {string} optionClass custom select class. Defaults to 'cv19option'
 */
export const createSelectBox = (
  containerId,
  property,
  options,
  onChange,
  selectClass = 'cv19select',
  optionClass = 'cv19option'
) => {
  const id = `${property}_select`;

  const select = d3
    .select(`#${containerId}`)
    .append('select')
    .attr('class', selectClass)
    .attr('id', id)
    .on('change', () => {
      const val = d3.select(`#${id}`).property('value');
      onChange({ [property]: val });
    });

  select
    .selectAll('option')
    .data(options)
    .enter()
    .append('option')
    .attr('class', optionClass)
    .text((d) => d);
};
