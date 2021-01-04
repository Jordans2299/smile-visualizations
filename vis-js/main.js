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
let overviewMapArticle;



//TypeIt 
new TypeIt("#typed-introduction", {
    strings: ["\"Happiness is when what you think, what you say, and what you do are in harmony.\" -- Confucius",
        "The pursuit of happiness has been widely recognized as part of our lifetime goal.",
        "Even though we probably can't quantify happiness, we can still feel its existence.",
        "By visualizing data from multiple sources, we hope to provide you with important information about the origins of happiness.",
        "In several minutes, you will understand which regions are the happiest, and what factors can make people happy."
    ],
    speed: 25,
    loop: false
}).go();

const sound = new Howl({
    src: ['./sound/the_sea_dragon_comes_aigei_com.mp3']
});

// Play the sound.
sound.play();

// Change global volume.
Howler.volume(0.025);

setTimeout(function() {
    document.getElementById("button-for-introduction").innerHTML = "<button class=\"btn btn-success\" id=\"analysis-page\">Go to the analysis </button>"
    document.getElementById("analysis-page").addEventListener("click", function() {
        document.getElementById("explanation-prep").scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
    });
    //sound.stop();
}, 16000);






// Variable for the visualization instance
// Start application by loading the data
var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
    "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
    "Southern Asia"
]
var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
var newArray = domain.map((e, i) => [e, range[i]])
console.log(newArray)
var colorsvgExplore = d3.select("#chartExploreLegend").append("svg")
    .attr("width", 350)
    .attr("height", 500);
colorsvgCompare = d3.select("#chartCompareLegend").append("svg")
    .attr("width", 350)
    .attr("height", 500);
colorsvgExplore.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(80,20)");
colorsvgCompare.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(80,20)");
// var colorPalette =d3.scaleOrdinal()
// .domain(domain).range(range);


//https://www.d3-graph-gallery.com/graph/custom_legend.html
var size = 20
colorsvgExplore.selectAll("mydots")
    .data(newArray)
    .enter()
    .append("rect")
    .attr("x", 100)
    .attr("y", function(d, i) { return 100 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d) { return d[1] })

// Add one dot in the legend for each name.
colorsvgExplore.selectAll("mylabels")
    .data(newArray)
    .enter()
    .append("text")
    .attr("x", 100 + size * 1.2)
    .attr("y", function(d, i) { return 100 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d) { return d[1] })
    .text(function(d) { return d[0] })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
colorsvgCompare.selectAll("mydots")
    .data(newArray)
    .enter()
    .append("rect")
    .attr("x", 100)
    .attr("y", function(d, i) { return 100 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d) { return d[1] })

// Add one dot in the legend for each name.
colorsvgCompare.selectAll("mylabels")
    .data(newArray)
    .enter()
    .append("text")
    .attr("x", 100 + size * 1.2)
    .attr("y", function(d, i) { return 100 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d) { return d[1] })
    .text(function(d) { return d[0] })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

// var colorCorrelations = d3.select("#smaller-charts-div").append("svg").attr("id", "smaller-charts-legend")
//     .attr("width", 300)
//     .attr("height", 280);

// colorCorrelations.append("g")
//     .attr("class", "legendOrdinal")
//     .attr("transform", "translate(80,20)");

// colorCorrelations.selectAll("mydots")
//     .data(newArray)
//     .enter()
//     .append("rect")
//     .attr("x", 100)
//     .attr("y", function(d, i) { return 20 + i * (size + 5) })
//     .attr("width", size)
//     .attr("height", size)
//     .style("fill", function(d) { return d[1] })

// colorCorrelations.selectAll("mylabels")
//     .data(newArray)
//     .enter()
//     .append("text")
//     .attr("x", 100 + size * 1.2)
//     .attr("y", function(d, i) { return 20 + i * (size + 5) + (size / 2) })
//     .style("fill", function(d) { return d[1] })
//     .text(function(d) { return d[0] })
//     .attr("text-anchor", "left")
//     .style("alignment-baseline", "middle")

/////////D3 Horizonal Lengend 1///////////////////////////
var width =800;
var height = 80;
var svgLegned4 = d3.select("#smaller-charts-div").append("svg")
.attr("width", width)
.attr("height", height - 50)

var dataL = 0;
var offset = 80;
var n = newArray.length/2;
var itemWidth =200;
var itemHeight = 18;

var legend4 = svgLegned4.selectAll('.legends4')
.data(newArray)
.enter().append('g')
.attr("class", "legends4")
.attr("transform", function(d,i) { 
    return "translate(" + i%n * itemWidth + "," + Math.floor(i/n) * itemHeight + ")"; 
})
// .attr("transform", function (d, i) {
//  if (i === 0) {
//     dataL = d.length + offset 
//     return "translate(0,0)"
// } else { 
//  var newdataL = dataL
//  dataL +=  d.length + offset
//  return "translate(" + (newdataL) + ",0)"
// }
// })

legend4.append('rect')
.attr("x", 0)
.attr("y", 0)
.attr("width", 10)
.attr("height", 10)
.style("fill", function(d) { return d[1] })

legend4.append('text')
.attr("x", 20)
.attr("y", 10)
//.attr("dy", ".35em")
.text(function(d) { return d[0] })
.attr("class", "textselected")
.style("text-anchor", "start")
.style("font-size", 12)
console.log("newArray: ")
console.log(newArray)
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
        createHappiestandUnhappiest();
    });
}

function filterContinentExplore() {
    let regionSelection = document.getElementById("continent-explore").value
    exploreChart.filterRegion(regionSelection)

}

function onSelectionChangeExplore() {
    let selectionAll = document.getElementById("metrics-explore").value;
    let xLabel = document.getElementById("metrics-explore").selectedOptions[0].attributes[1].textContent;
    exploreChart.onSelectionChange(selectionAll, xLabel)

}

function onSelectionChangeCompare() {
    let selectionCompare = document.getElementById("metrics-compare").value;
    let xLabel = document.getElementById("metrics-compare").selectedOptions[0].attributes[1].textContent;
    compareChart.onSelectionChange(selectionCompare, xLabel)

}

function createHappiestandUnhappiest() {
    overviewMapArticle = new ArticleOverviewMap("happiest-map", "world-map-description-paragraph", compareDataGDP)


}

function createVis() {
    let selectionAll = document.getElementById("metrics-explore").value;
    let xLabel = document.getElementById("metrics-explore").selectedOptions[0].attributes[1].nodeValue;
    exploreChart = new LineGraphTemplate("chart", allDataGDP, selectionAll, "Happiness_Score", xLabel, "Happiness Score", "All")
    compareChart = new LineGraphTemplate("chart-compare", compareDataGDP, selectionAll, "Happiness_Score", xLabel, "Happiness Score", "All")
    new CountriesHistogram("1", allDataGDP, "Happiness_Score", 300, 200);
    new CountriesHistogram("2", allDataGDP, "Happiness_Score", 300, 200);
    new CountriesHistogram("3", allDataGDP, "Happiness_Score", 300, 200);
    new CountriesHistogram("4", allDataGDP, "Happiness_Score", 300, 200);
    new CountriesHistogram("5", allDataGDP, "Happiness_Score", 300, 200);
    new CountriesHistogram("6", allDataGDP, "Happiness_Score", 300, 200);
    new CountriesHistogram("7", allDataGDP, "Happiness_Score", 300, 200);
    new CountriesHistogram("8", allDataGDP, "Happiness_Score", 300, 200);
    new CountriesHistogram("9", allDataGDP, "Happiness_Score", 300, 200);
    new CountriesHistogram("10", allDataGDP, "Happiness_Score", 300, 200);
    new CorrelationDisplay("one", allDataGDP, "Economy (GDP per Capita)", "Economy Score", "Happiness_Score", 380, 300);
    new CorrelationDisplay("two", allDataGDP, "Health (Life Expectancy)", "Health Score", "Happiness_Score", 380, 300);
    new CorrelationDisplay("three", allDataGDP, "Family", "Environment Score", "Happiness_Score", 380, 300);
    new CorrelationDisplay("four", allDataGDP, "Freedom", "Social Score", "Happiness_Score", 380, 300);
    overviewmap = new OverviewMap("world-map-color-coded", allDataGDP)



}