//  Datasets: https://github.com/nytimes/covid-19-data/
//  Controler for initializing Charts
import init from "./data";
import LineChart from "./LineChart";

const main = async () => {
  const overlay = document.getElementById("overlay");

  await init().then((data) => {
    LineChart(data);
    console.log("Initialized data sets", Object.keys(data));
    setTimeout(() => {
      overlay.style.display = "none";
    }, 500);
  });
};
main();
