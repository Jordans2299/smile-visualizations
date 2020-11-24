var allDataGDP = [];
var sadDataGDP=[]
var happyDataGDP=[];
var allDataWorld = [];
var overviewMapData=[];
var happyOverTimeData=[];
var compareDataGDP=[];
var longeVityData=[];
var suicideData = [];

// Variable for the visualization instance
// Start application by loading the data
loadData();


function loadData() {
    
var files = ["./../data/world-happiness-report-2015.csv", "./../data/Life Expectancy Data.csv","../data/suicideStats1985-2016.csv"];
var promises = [];

files.forEach(function(url) {
    promises.push(d3.csv(url))
});
Promise.all(promises).then(function(values) {
            
            allDataGDP = values[0];
            longeVityData=values[1].filter(country=>country.Year=="2015")
            //console.log(longeVityData)
            happyDataGDP=values[0].slice(0, 15)
            sadDataGDP=values[0].slice(140)
            compareDataGDP= happyDataGDP.concat(sadDataGDP)
            overviewMapData=values[0];
            suicideData = values[2];
            //console.log(allDataGDP)
            createVis();
        });
}

function createVis() {
    let chart;
    let overviewmap;
    overviewmap = new OverviewMap("world-map-color-coded", overviewMapData) 
   
    let selectionAll = document.getElementById("metrics-explore").value;
    let selectionCompare=document.getElementById("metrics-compare").value;
    if (selectionCompare=="GDP"){
        chart = new WorldMapGDP("chart-compare", compareDataGDP)
    }
    else if (selectionCompare=="life-expectancy"){
        chart = new LifeExpectancyChart("chart-compare", compareDataGDP, longeVityData)
    }

   
    if (selectionAll=="GDP"){
        chart = new WorldMapGDP("chart", allDataGDP)
    }
    else if (selectionAll=="life-expectancy"){
        chart = new LifeExpectancyChart("chart", allDataGDP, longeVityData)
    }
    else if(selectionAll=="suicide-rate"){
        chart = new SuicideRateChart("chart", allDataGDP, suicideData)
    }
   

    
    

    
}
