var allDataGDP = [];
var sadDataGDP=[]
var happyDataGDP=[];
var allDataWorld = [];
var overviewMapData=[];
var happyOverTimeData=[];
var compareDataGDP=[];

// Variable for the visualization instance
// Start application by loading the data
loadData();


function loadData() {
var files = ["./../data/world-happiness-report-2015.csv"];
var promises = [];

files.forEach(function(url) {
    promises.push(d3.csv(url))
});
Promise.all(promises).then(function(values) {
            allDataGDP = values[0];
            happyDataGDP=values[0].slice(0, 15)
            sadDataGDP=values[0].slice(140)
            console.log("Sad data" + JSON.stringify(sadDataGDP))
            compareDataGDP= happyDataGDP.concat(sadDataGDP)
            console.log("Compare data" + compareDataGDP)
            overviewMapData=values[0];
            createVis();
        });
}


function createVis() {
    OverviewMap = new OverviewMap("world-map-color-coded", overviewMapData) 
    HappyGDP = new WorldMapGDP("all-gdp", allDataGDP)
    // SadGDP=new WorldMapGDP("not-happy-gdp", sadDataGDP)
    CompareGDP= new WorldMapGDP("compare-gdp", compareDataGDP )

    
    

    
}