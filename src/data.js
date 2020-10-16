import * as d3 from "d3";

// SuperFeature: Create a git event that pulls in datasets locally when theres a push to the master branch
// TODO add a time stamp to local storage and make the init function refresh the data if greater than one day
const StorageIndex = "cv19data";

/**
 * Helper function to handle local storage
 * @param  {"set" | "get" | "remove"} action list of storage options
 * @param  {any} payload must have for set (OBJECT with all the data)
 * @return {[Object]} will only return if "get" for actioin
 */
const localStorageHelper = (action, payload) => {
  let returnVal = null;
  switch (action) {
    case "set":
      localStorage.setItem(StorageIndex, JSON.stringify(payload));
      break;
    case "get":
      returnVal = localStorage.getItem(StorageIndex);
      break;
      //pick id remove
    case "remove":
      localStorage.removeItem(StorageIndex);
      break;
    default:
      break;
  }
  return returnVal ? JSON.stringify(returnVal) : null;
};

/**
 * Helper function to supply data to charts
 * @param  {Array<"states" | "colleges" | "us" | "counties" | "mask_use" | "excess_deaths">} list list of datasets to pull
 * @param  {boolean} all overides list and pulls all datasets
 * @return {[Object]} object with keys from the list or all with full csv array
 */
export const getAllData = async (list, all = false) => {
  // localData : {date: timestamp, data: {}}
  const localData = localStorageHelper("get");
  const data = {};

  // Hacktoberfest first PR Issues
  // 1) Check if date is older than one day. Do not return local data if it is
  // 2) only return requested datasets if all is false
  if (localData && localData.date) {
    return localData.data;
  }

  if (list.includes("states") || all) {
    // date,state,fips,cases,deaths
    const raw = await d3.csv(
      "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv"
    );

    // TODO compile list by state
    // move cases -> cases_acum
    let statesData = {};
    for (let j = 0; j < raw.length; j++) {
      let dataPoint = raw[j];

      if (statesData[dataPoint.state]) {
        statesData[dataPoint.state].push(dataPoint);
      } else {
        statesData[dataPoint.state] = [dataPoint];
      }
    }

    Object.entries(statesData).forEach(([name, data]) => {
      let totalCases = Number(data[0]?.cases || 0);
      let totalDeaths = Number(data[0]?.deaths || 0);
      statesData[name] = data.map((d, i) => {
        const current = { ...d };
        current.cases_accum = Number(current.cases);
        current.deaths_accum = Number(current.deaths);
        current.cases = Number(current.cases) - totalCases;
        current.deaths = Math.max(Number(current.deaths) - totalDeaths, 0);
        current.date = new Date(current.date);
        totalCases += current.cases;
        totalDeaths += current.deaths;
        return current;
      });
    });
    data.states = statesData;
  }

  if (list.includes("colleges") || all) {
    // date,state,county,city,ipeds_id,college,cases,notes
    data.colleges = await d3.csv(
      "https://raw.githubusercontent.com/nytimes/covid-19-data/master/colleges/colleges.csv"
    );
  }

  if (list.includes("us") || all) {
    // date,cases,deaths,confirmed_cases,confirmed_deaths,probable_cases,probable_deaths
    data.us = await d3.csv(
      "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us.csv"
    );
  }

  if (list.includes("counties") || all) {
    // date,county,state,fips,cases,deaths,confirmed_cases,confirmed_deaths,probable_cases,probable_deaths
    data.counties = await d3.csv(
      "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv"
    );
  }

  if (list.includes("mask_use") || all) {
    // COUNTYFP,NEVER,RARELY,SOMETIMES,FREQUENTLY,ALWAYS
    data.mask_use = await d3.csv(
      "https://raw.githubusercontent.com/nytimes/covid-19-data/master/mask-use/mask-use-by-county.csv"
    );
  }

  if (list.includes("excess_deaths") || all) {
    // country,placename,frequency,start_date,end_date,year,month,week,deaths,expected_deaths,excess_deaths,baseline
    data.excess_deaths = await d3.csv(
      "https://raw.githubusercontent.com/nytimes/covid-19-data/master/excess-deaths/deaths.csv"
    );
  }

  if (all) {
    localStorageHelper("set", { date: Date.now(), data });
  }

  return data;
};

/**
 * Returns all data and saves it in local storage
 * @return {[Object]} object with keys from the list or all with full csv array
 */
export default async () => getAllData([], true);
