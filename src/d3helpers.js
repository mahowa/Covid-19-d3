import * as d3 from "d3";

// HacktoberFest Issue: Add JS docs (HINT: Look for examples in other files)
export const addContainer = (id) => {
  d3.select("#root").append("div").attr("id", id);
};
