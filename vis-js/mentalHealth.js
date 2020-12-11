MentalHealthChart = function (_parentElement, _happinessData, _auxiliaryData) {
    this.parentElement = _parentElement;
    this.happinessData = _happinessData;
    this.auxiliaryData = _auxiliaryData;
    this.width = 700;
    this.height = 500;
    this.initVis();
}

MentalHealthChart.prototype.initVis = function () {
    var vis = this;
    var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
        "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
        "Southern Asia"]
    var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
    vis.colorPalette = vis.colorScale = d3.scaleOrdinal()
        .domain(domain).range(range);

    vis.svg = d3.select("#" + vis.parentElement)
    vis.padding = 20;
    console.log("Mental Health Data")
    console.log(vis.auxiliaryData)
    //vis.wrangleData();
}

MentalHealthChart.prototype.wrangleData = function () {


    let countryHappinessDict = {}

    let countrySuicideRateDict = {}

    let happinessData = [];
    var vis = this;
    for(let i=0;i<vis.happinessData.length;i++){
        let data = vis.happinessData;
        countryHappinessDict[data[i]["Country"]] = data[i]["Happiness_Score"]
    }

    let data = vis.auxiliaryData
    var mySet = new Set(); 
    let newData = [];
    for(let i=0;i<data.length; i++){
        countrySuicideRateDict[data[i].country] = 0
    }
    for(let i=0;i<data.length; i++){
        countrySuicideRateDict[data[i].country] = (countrySuicideRateDict[data[i].country] + +data[i]["suicides/100k pop"])/2;
    }
    for(let i=0;i<data.length;i++){
        if(countryHappinessDict[data[i].country]!= undefined && !mySet.has(data[i].country) && countrySuicideRateDict[data[i].country]>0){
            let country = {country: data[i].country, region: countryToRegionDict[data[i].country], suicideRate: countrySuicideRateDict[data[i].country], happiness: +countryHappinessDict[data[i].country]}
            mySet.add(data[i].country)
            newData.push(country)
        }
    }
    vis.data = newData
    vis.xScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function (d) { return d.suicideRate-1; }), d3.max(vis.data, function (d) { return d.suicideRate; }) + 5]) // input
        .range([vis.padding / 2, vis.width]); // output


    vis.yScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function (d) { return d.happiness; }) - 3, d3.max(vis.data, function (d) { return d.happiness; }) + 3]) // input
        .range([vis.height - vis.padding / 2, vis.padding / 2]); // output
    console.log("hi")
    console.log(vis.data)
    // Update the visualization
    vis.updateVis();
}

MentalHealthChart.prototype.updateVis = function () {

    var vis = this;

    let padding = 20;
    svg = vis.svg

    svg.selectAll("*").remove();

    let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    svg.selectAll("circle")
        .data(vis.data) // parse through our data
        .enter()
        .append("circle") // create place holder each data item and replace with rect
        .style("fill", function (d) { return vis.colorPalette(d.region); })
        .attr("r",10)
        .attr("cx", function(d) { return vis.xScale(d.suicideRate); }) 
        .attr("cy", function(d) { return vis.yScale(d.happiness); })



    // Create an axis function specifying orientation (top, bottom, left, right)
    let xAxis = d3.axisBottom();

    // Pass in the scale function
    xAxis.scale(vis.xScale)

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (vis.height - 1.5 * vis.padding) + ")")

        .call(xAxis)

        .append('text')
        .attr("fill", "black")
        .text('Suicide Rate')
        .attr("x", 630)
        .attr("y", 0)


    let yAxis = d3.axisLeft();

    // Pass in the scale function
    yAxis.scale(vis.yScale);

    // Draw the axis
    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + (vis.padding) + ",0)")
        .call(yAxis)

        .append('text')
        .attr("fill", "black")
        .text('Happiness Score')
        .attr("x", 80)
        .attr("y", 48);
}