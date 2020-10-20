jest.mock('d3');
import * as d3 from 'd3';
import init, { StorageIndex } from "../src/data";
import data from './mock-data/states.json';

describe('test getAllData', () => {
  let expectedResult;
  beforeEach(() => {
    d3.csv.mockReturnValue(Promise.resolve(data));
    expectedResult = {
      "Washington":[
        {
          "date":"2020-01-21T00:00:00.000Z",
          "state":"Washington",
          "fips":53,
          "cases":0,
          "deaths":0,
          "cases_accum":1,
          "deaths_accum":0
        },
        {
          "date":"2020-01-22T00:00:00.000Z",
          "state":"Washington",
          "fips":53,
          "cases":0,
          "deaths":0,
          "cases_accum":1,
          "deaths_accum":0
        },
        {
          "date":"2020-01-23T00:00:00.000Z",
          "state":"Washington",
          "fips":53,
          "cases":0,
          "deaths":0,
          "cases_accum":1,
          "deaths_accum":0
        },
        {
          "date":"2020-01-24T00:00:00.000Z",
          "state":"Washington",
          "fips":53,
          "cases":0,
          "deaths":0,
          "cases_accum":1,
          "deaths_accum":0
        },
        {
          "date":"2020-01-25T00:00:00.000Z",
          "state":"Washington",
          "fips":53,
          "cases":0,
          "deaths":0,
          "cases_accum":1,
          "deaths_accum":0
        }
      ],
      "Illinois":[
        {
          "date":"2020-01-24T00:00:00.000Z",
          "state":"Illinois",
          "fips":17,
          "cases":0,
          "deaths":0,
          "cases_accum":1,
          "deaths_accum":0
        },
        {
          "date":"2020-01-25T00:00:00.000Z",
          "state":"Illinois",
          "fips":17,
          "cases":0,
          "deaths":0,
          "cases_accum":1,
          "deaths_accum":0
        }
      ],
      "California":[
        {
          "date":"2020-01-25T00:00:00.000Z",
          "state":"California",
          "fips":"06",
          "cases":0,
          "deaths":0,
          "cases_accum":1,
          "deaths_accum":0
        },
        {
          "date":"2020-01-26T00:00:00.000Z",
          "state":"California",
          "fips":"06",
          "cases":1,
          "deaths":0,
          "cases_accum":2,
          "deaths_accum":0
        }
      ],
      "Arizona":[
        {
          "date":"2020-01-26T00:00:00.000Z",
          "state":"Arizona",
          "fips":"04",
          "cases":0,
          "deaths":0,
          "cases_accum":1,
          "deaths_accum":0
        }
      ]
    };
  });
  test('should return all data', async () => {
    const result = await init();
    expect(JSON.stringify(result.states)).toEqual(JSON.stringify(expectedResult));
  });

  test('should set data in localStorage', async () => {
    await init();
    const result = JSON.parse(localStorage.getItem(StorageIndex));
    expect(JSON.stringify(result.data.states)).toEqual(JSON.stringify(expectedResult));
  });
});
