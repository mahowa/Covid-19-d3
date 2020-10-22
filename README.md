The most [up to date code](https://codesandbox.io/s/github/mahowa/Covid-19-d3)

# D3 Charts using Covid-19 Live Data
D3 stands for Data-Driven Documents, which is used to create a static SVG chart. It helps to draw various types of charts:
1)  Bar Chart
2) Circle Chart
3)    Pie Chart
4) Donut Chart
5)  Line Chart
6)  Bubble Chart; and many more.This project mainly focuses on Line Charts.A line chart is a type of chart which displays information as a series of dataPoints connected by straight line segments. Each dataPoint has x variable determining the position on the horizontal axis and y variable determining the position of the vertical axis.
Markers are automatically disabled when there are large number of dataPoints. You can override this behaviour by manually setting markerSize to a value greater than zero. 

Steps on how to create a line graph are as follows:

    1. The HTML part of the code just creates a div that will be modified by D3 later on.
    2. The first part of the JavaScript code set an SVG area. It specifies the chart size and its margin. 
    3. For example the data herein, shows, the increase in number of Corona virus patients as the time increases.
    4. Line is drawn using a path, and using the d3.line utility.

Now that the chart is made, let's know how to style it, and following are the points which should be kept in mind while doing so:
1.  AXIS
2.  COLORS  
3.  THEMES 
4.  RESPONSIVENESS
5.  LEGEND

You can easily fork this project on [CodeSandbox](https://codesandbox.io/s/github/mahowa/Covid-19-d3)

This project is about D3 examples using real life data on real scenarios.

NY Times Live Dataset: https://github.com/nytimes/covid-19-data/tree/master/live

![Current View](current_view.gif)

*NOTE: Please update this picutre if you make changes to the ui/add anything to the page*

## HACKTOBERFEST
- For any queries, switch to the [FAQ](https://hacktoberfest.digitalocean.com/faq) section.
- Sign up to the Hacktober Fest and enjoy the open source festival all month long.[Sign Up](https://hacktoberfest.digitalocean.com/)

### HACKTOBER FEST [Issues](https://github.com/mahowa/Covid-19-d3/issues):

    1.  Update this Readme with information found in the codebase
        - Something like how to create a chart
        - How to custom style a chart
    2.  Write a test
    3.  Add date range selector
    4.  Update styles
    5.  Add some more data sets
    6.  Create a chart
       - Heatmap of us
    7.  Add tool tips
    8.  Add more documentation or helpful information to the comments in the code
    9.  Make a global styles file and move styles in the index.js into that file

HINT: Look through the code. There are some notes on things that might help you get started Hacking.

## Getting Started

Fork this project on [CodeSandbox](https://codesandbox.io/s/github/mahowa/Covid-19-d3) which is by far the easiest way to get started

#### Work on it locally

Run `npm i && npm run start`


## Contributing
If you've ever wanted to contribute to open source, and a great cause, now is your chance!

I will make sure everyone gets credit as long as its not a spam request. Even if you do a task someone else does. Contribute!!

See these [contributing how to docs](http://opensource.guide/how-to-contribute/) for more information.

If you create a PR I'll add you as a Hacktoberfest Contributor to the Readme using a [bot](https://allcontributors.org/docs/en/bot/usage);

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://matthowa.com"><img src="https://avatars0.githubusercontent.com/u/8989577?v=4" width="100px;" alt=""/><br /><sub><b>Matt Howa</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=mahowa" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/irina-chernik"><img src="https://avatars3.githubusercontent.com/u/2941184?v=4" width="100px;" alt=""/><br /><sub><b>Irina Chernik</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=irina-chernik" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/novalkrnfds"><img src="https://avatars1.githubusercontent.com/u/26252417?v=4" width="100px;" alt=""/><br /><sub><b>Nouval Kurnia Firdaus</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=novalkrnfds" title="Code">💻</a></td>
    <td align="center"><a href="http://jivthesh.github.io"><img src="https://avatars3.githubusercontent.com/u/20579980?v=4" width="100px;" alt=""/><br /><sub><b>Jivthesh M R</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=jivthesh" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Anamika810"><img src="https://avatars1.githubusercontent.com/u/55596686?v=4" width="100px;" alt=""/><br /><sub><b>Anamika810</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=Anamika810" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lakshyaTaragi"><img src="https://avatars0.githubusercontent.com/u/72077704?v=4" width="100px;" alt=""/><br /><sub><b>Lakshya Taragi</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=lakshyaTaragi" title="Code">💻</a></td>
    <td align="center"><a href="https://henrynguyen.design/"><img src="https://avatars0.githubusercontent.com/u/37063961?v=4" width="100px;" alt=""/><br /><sub><b>Henry Nguyen</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=hn4733" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/ashish979/"><img src="https://avatars2.githubusercontent.com/u/7333996?v=4" width="100px;" alt=""/><br /><sub><b>Ashish Agrawal</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=ashish979" title="Code">💻</a></td>
    <td align="center"><a href="https://adncodez.com"><img src="https://avatars2.githubusercontent.com/u/20237313?v=4" width="100px;" alt=""/><br /><sub><b>Adnan Habbat</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=AdnCodez" title="Code">💻</a></td>
    <td align="center"><a href="https://cloakspace.tech/"><img src="https://avatars2.githubusercontent.com/u/60067940?v=4" width="100px;" alt=""/><br /><sub><b>Subham Das</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=das-jishu" title="Code">💻</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/simonhoyos/"><img src="https://avatars1.githubusercontent.com/u/23706543?v=4" width="100px;" alt=""/><br /><sub><b>Simon Hoyos</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=simonhoyos" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/cardinalion"><img src="https://avatars0.githubusercontent.com/u/32423248?v=4" width="100px;" alt=""/><br /><sub><b>cardinalion</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=cardinalion" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/augusto-jm-amaral"><img src="https://avatars1.githubusercontent.com/u/10222646?v=4" width="100px;" alt=""/><br /><sub><b>Augusto Amaral</b></sub></a><br /><a href="https://github.com/mahowa/Covid-19-d3/commits?author=augusto-jm-amaral" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

PRs which are welcomed by us:
1. Ones which you are assigned to do.
2. Your PR has to link the issue.
3. Your solution must be correct.

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

*Created with [CodeSandbox](https://codesandbox.io/s/github/mahowa/Covid-19-d3)*
Thank you!
