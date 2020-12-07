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
    if (selectionOfWorldMap == "data-country-or-region") {
        document.getElementById("world-map-color-coded").innerHTML = "";
        overviewmap = new OverviewMap("world-map-color-coded", overviewMapData)
    } else if (selectionOfWorldMap == "data-continent") {
        document.getElementById("world-map-color-coded").innerHTML = "";
        overviewmap = new ContinentMap("world-map-color-coded", overviewContinentData)
    }

//     let selectionOfWorldMap = document.getElementById("world-explore").value;
   

//     //console.log(selectionOfWorldMap);


//     if (selectionOfWorldMap == "data-country-or-region") {
//         document.getElementById("world-map-color-coded").innerHTML = "";
//         overviewmap = new OverviewMap("world-map-color-coded", overviewMapData)
//     } else if (selectionOfWorldMap == "data-continent") {
//         document.getElementById("world-map-color-coded").innerHTML = "";
//         overviewmap = new ContinentMap("world-map-color-coded", overviewContinentData)
//     }
//     if (selectionCompare == "GDP") {
//         chart = new WorldMapGDP("chart-compare", compareDataGDP)
//     } else if (selectionCompare == "life-expectancy") {
//         chart = new LifeExpectancyChart("chart-compare", compareDataGDP, longeVityData)
//     }


//     if (selectionAll == "GDP") {
//         chart = new WorldMapGDP("chart", allDataGDP)
//     } else if (selectionAll == "life-expectancy") {
//         chart = new LifeExpectancyChart("chart", allDataGDP, longeVityData)
//     } else if (selectionAll == "suicide-rate") {
//         chart = new SuicideRateChart("chart", allDataGDP, suicideData)
//     }


}


