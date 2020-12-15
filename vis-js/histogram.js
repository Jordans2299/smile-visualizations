CountriesHistogram = function(_parentElement, _data, xLabel, width, height) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.xLabel = xLabel;
    this.width = width;
    this.height = height;
    this.initVis();
}
/*
 *  Initialize station map
 */

CountriesHistogram.prototype.initVis = function() {
    var vis = this;

    var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
        "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
        "Southern Asia"]
    var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
    vis.colorPalette = vis.colorScale = d3.scaleOrdinal()
        .domain(domain).range(range);

    vis.svg = d3.select("#happinessHisto" + vis.parentElement)
    vis.padding = 40;
    vis.makeDataReadable();
}

/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
CountriesHistogram.prototype.tooltip_render = function(tooltip_data) {
    var self = this;
    var text = "<ul>";
    //tooltip_data.forEach(function(row) {
    text += "<li>" + "<h3>" + " " + "\t\t" + tooltip_data.Country + "</h3>" + "</li>" + "<li>" + " Life expectancy" + ":\t\t" + tooltip_data.Life_expectancy + "</li><li> Family Number: " + "\t\t" + tooltip_data.Family + "</li><li>Region" + ":\t\t" + tooltip_data.Region + "" + "</li>"
        //});

    return text;
}


CountriesHistogram.prototype.makeDataReadable=function() {
    let vis = this;
    

    vis.data.forEach(function(d){
        // Update the visualization
        d["Happiness Rank"] = +d["Happiness Rank"];
        d["Happiness_Score"] = +d["Happiness_Score"];
        d["Standard Error"] = +d["Standard Error"];
        d["Economy (GDP per Capita)"] = +d["Economy (GDP per Capita)"];
        d["Family"] = +d["Family"];
        d["Health (Life Expectancy)"] = +d["Health (Life Expectancy)"];
        d["Freedom"] = +d["Freedom"];
        d["Trust (Government Corruption)"] = +d["Trust (Government Corruption)"];
        d["Generosity"] = +d["Generosity"];
        d["Dystopia Residual"] = +d["Dystopia Residual"];
        d["Life_expectancy "] = +d["Life_expectancy "]
    });
    vis.wrangleData();
}

/*
 *  Data wrangling
 */

CountriesHistogram.prototype.wrangleData = function() {
    let vis= this;
    
    vis.xScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([0, d3.max(vis.data, function(d) { return d[vis.x]+.01; })]) // input
        .range([vis.padding, vis.width]); // output

    vis.yScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function(d) { return d[vis.y]; }), d3.max(vis.data, function(d) { return d[vis.y]; })]) // input
        .range([vis.height - vis.padding / 2, vis.padding]); // output

    vis.updateVis();

}


/*
 *  The drawing function
 */

CountriesHistogram.prototype.updateVis = function() {
    let vis = this;
    let svg = vis.svg
    
    let regionsList = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
    "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
    "Southern Asia"]

    let dataGroupedByRegion =  d3.group(vis.data, d => d.Region)
    console.log(regionsList[+vis.parentElement - 1])
    console.log(dataGroupedByRegion.get(regionsList[+vis.parentElement - 1]))
    let data = dataGroupedByRegion.get(regionsList[+vis.parentElement - 1])



 let margin = {top: 10, right: 30, bottom: 30, left: 40}
    let width = vis.width - margin.left - margin.right
    let height = vis.height - margin.top - margin.bottom;

     // X axis: scale and draw:
let x = d3.scaleLinear()
  .domain([0, 8]) //d3.max(data, function(d) { return +d[vis.xLabel] })
  .range([margin.left,width]);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

let histogram = d3.histogram()
  .value(function(d) { return d[vis.xLabel]; })   // I need to give the vector of value
  .domain([d3.min(data, function(d) { return +d[vis.xLabel] }),d3.max(data, function(d) { return +d[vis.xLabel] })])  // then the domain of the graphic
//   .thresholds(x.ticks(10)); // then the numbers of bins

// And apply this function to data to get the bins
var bins = histogram(vis.data);

// Y axis: scale and draw:
var y = d3.scaleLinear()
  .range([height, margin.bottom]);
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
svg.append("g")
.attr("transform", "translate("+margin.left+",0)")

  .call(d3.axisLeft(y));

  svg.selectAll("rect")
  .data(bins)
  .enter()
  .append("rect")
    .attr("x", 1)
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function(d) { 
        console.log()
        if(x(d.x1) - x(d.x0)<1){
            return 1
        }
        return x(d.x1) - x(d.x0) ; })
    .attr("height", function(d) { return height - y(d.length); })
    .style("fill",vis.colorPalette(regionsList[+vis.parentElement - 1]))

let happyHisto = document.getElementById("histHeading"+vis.parentElement)
happyHisto.innerHTML = regionsList[+vis.parentElement - 1]


// append the bar rectangles to the svg elements
// Use D3's nest function to group the data by borough
// let mapGroupedByRegion =  d3.group(data, d => d.Region)



/*
//stacked histogram
let keys=["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
"Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
"Southern Asia"]

var margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 50
},
width = vis.width - margin.left - margin.right,
height = vis.height - margin.top - margin.bottom;

var x = d3.scaleLinear()
.domain([d3.min(data, function(d) { return +d[vis.xLabel]}), d3.max(data, function(d) { return +d[vis.xLabel] })])
.range([margin.left,width]);

var y = d3.scaleLinear()
.range([height, 0]);


svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

svg.append("g")
.attr("transform", "translate("+margin.left+",0)")
  .call(d3.axisLeft(y));

var stack = d3.stack()
.keys(keys)
.value(function(d){
    return d.values
})


var scoreExtent = d3.extent(data, function(d) {
    return d[vis.xLabel];
});

// Create one bin per month, use an offset to include the first and last months
var scoreBins = d3.range(scoreExtent[0]-1,scoreExtent[1]+1);
console.log(scoreBins)
// Use the histogram layout to create a function that will bin the data
var binByScore = d3.bin()
    .value(function(d) {
        return d[vis.xLabel];
    })
    .thresholds(x.ticks(50));

// Use D3's nest function to group the data by borough
let dataGroupedByRegion =  d3.group(data, d => d.Region)

var histDataByRegion = [];
dataGroupedByRegion.forEach(function(value, key) {
    var histData = binByScore(value);
    histDataByRegion.push({
        region: key,
        values: histData
    });
});

let y0 =0
for(let i=0;i<histDataByRegion.length;++i){
    y0=0
    let y1 =y0
    for(let j=0;j<histDataByRegion[i].values.length;++j){
        y1 += +histDataByRegion[i].values[j].length
        histDataByRegion[i].values[j].y0 = y0;
        histDataByRegion[i].values[j].y1 = y1;
    }
    y0+=y1
}
console.log("hist data")
console.log(histDataByRegion)

let test = d3.max(histDataByRegion[histDataByRegion.length - 1].values, function(d) {
    return +d.y1;
});


y.domain([0, d3.max(histDataByRegion[histDataByRegion.length - 1].values, function(d) {
    return +d.y1+ +d.y0;
})]);


// Set up one group for each borough
// Note that color doesn't have a domain set, so colors are assigned to boroughs
// below on a first come, first serve basis
var region = svg.selectAll(".region")
    .data(histDataByRegion)
    .enter().append("g")
    .attr("class", "region")
    .style("fill", function(d, i) {
        return vis.colorPalette(d.region);
    })
    .style("stroke", function(d, i) {
        return d3.rgb(vis.colorPalette(d.region)).darker();
    });

// Months have slightly different lengths so calculate the width for each bin
// Draw the rectangles, starting from the upper left corner and going down
region.selectAll(".bar")
.data(function(d) {
    return d.values;
})
.enter().append("rect")
.attr("class", "bar")
.attr("x", function(d) {
    return x(d.x0);
})
.attr("width", function(d) {
    return x(d.x1) - x(d.x0)
})
.attr("y", function(d) {
    return y(d.y0 + d.y1);
})
.attr("height", function(d) {
    return y(d.y1) - y(d.y0 + d.y1);
});

*/
}


