var allDataGDP = [];
var sadDataGDP = []
var happyDataGDP = [];
var allDataWorld = [];
var overviewMapData = [];
var overviewContinentData = [];
var happyOverTimeData = [];
var compareDataGDP = [];
var longeVityData = [];
var suicideData = [];
let exploreChart;
let compareChart;
let overviewmap;
var freedomData = []

// Variable for the visualization instance
// Start application by loading the data
var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
"Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
"Southern Asia"
]
var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
var newArray = domain.map((e,i) => [e,range[i]])
console.log(newArray)
var colorsvg = d3.select("#chartExploreLegend").append("svg")
.attr("width", 350)
.attr("height", 500);
colorsvg.append("g")
.attr("class", "legendOrdinal")
.attr("transform", "translate(80,20)");
// var colorPalette =d3.scaleOrdinal()
// .domain(domain).range(range);


//https://www.d3-graph-gallery.com/graph/custom_legend.html

var size = 20
colorsvg.selectAll("mydots")
  .data(newArray)
  .enter()
  .append("rect")
    .attr("x", 100)
    .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return d[1]})

// Add one dot in the legend for each name.
colorsvg.selectAll("mylabels")
  .data(newArray)
  .enter()
  .append("text")
    .attr("x", 100 + size*1.2)
    .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return d[1]})
    .text(function(d){ return d[0]})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")





// var legendOrdinal = d3.legendColor()
// .scale(colorPalette);
//  colorsvg.select(".legendOrdinal")
 
// .data(range)
// .enter()
// .attr("x", 20)
// .attr("height", 5)
// .attr("width", 5)
// .attr("y", function(d, i) {
//     return i * 30
// })
// .attr("fill", function (d){
//     return d;
// })
//.call(legendOrdinal);
loadData();


function loadData() {

    var files = ["data/new_data_cleaned.csv", "data/continents.json"];
    //var files = ["data/world-happiness-report-2015.csv", "data/Life Expectancy Data.csv", "data/suicideStats1985-2016.csv", "data/continents.json",
    //"data/freedomIndex_2018.csv"];

    var promises = [];

    files.forEach(function(url) {
        promises.push(d3.csv(url))
    });
    Promise.all(promises).then(function(values) {

        allDataGDP = values[0]
        //console.log(longeVityData)
        happyDataGDP = values[0].slice(0, 15)
        sadDataGDP = values[0].slice(140)
        compareDataGDP = happyDataGDP.concat(sadDataGDP)
        overviewMapData = values[0];
        overviewContinentData = values[1];
        //console.log(allDataGDP)
        createVis();
    });
}
function filterContinentExplore() {
    let regionSelection = document.getElementById("continent-explore").value
    exploreChart.filterRegion(regionSelection)
    
}
function onSelectionChangeExplore() {
    console.log("Hello????")
    let selectionAll = document.getElementById("metrics-explore").value;
    let xLabel = document.getElementById("metrics-explore").selectedOptions[0].attributes[1].textContent;
    exploreChart.onSelectionChange(selectionAll, xLabel)

}

function onSelectionChangeCompare() {
    let selectionCompare = document.getElementById("metrics-compare").value;
    let xLabel = document.getElementById("metrics-compare").selectedOptions[0].attributes[1].textContent;
    compareChart.onSelectionChange(selectionCompare, xLabel)
    
}

function createVis() {
    let selectionAll = document.getElementById("metrics-explore").value;
    let xLabel = document.getElementById("metrics-explore").selectedOptions[0].attributes[1].nodeValue;
    exploreChart = new LineGraphTemplate("chart", allDataGDP, selectionAll, "Happiness_Score", xLabel, "Happiness Score", "All")
    compareChart = new LineGraphTemplate("chart-compare", compareDataGDP, selectionAll, "Happiness_Score", xLabel, "Happiness Score", "All")
    new CountriesHistogram("happinessHisto",allDataGDP, "Happiness_Score", 600,500);
    new CorrelationDisplay("one",allDataGDP,"Economy (GDP per Capita)","Happiness_Score", 500,250);
    new CorrelationDisplay("two",allDataGDP,"Health (Life Expectancy)","Happiness_Score", 500,250);
    new CorrelationDisplay("three",allDataGDP,"Family","Happiness_Score", 500,250);
    new CorrelationDisplay("four",allDataGDP,"Freedom","Happiness_Score", 500,250);
    overviewmap = new OverviewMap("world-map-color-coded", allDataGDP)
   


}
