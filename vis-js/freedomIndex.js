FreedomIndexChart = function (_parentElement, _happinessData, _auxiliaryData) {
    this.parentElement = _parentElement;
    this.happinessData = _happinessData;
    this.auxiliaryData = _auxiliaryData;
    this.width = 700;
    this.height = 500;
    this.initVis();
}

FreedomIndexChart.prototype.initVis = function () {
    var vis = this;
    var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
        "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
        "Southern Asia"]
    var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
    vis.colorPalette = vis.colorScale = d3.scaleOrdinal()
        .domain(domain).range(range);

    vis.svg = d3.select("#" + vis.parentElement)
    vis.padding = 20;
    // console.log("Freedom Data")
    // console.log(vis.auxiliaryData)
    // console.log(vis.happinessData)
    vis.wrangleData();
}

FreedomIndexChart.prototype.wrangleData = function () {
    let countryHappinessDict = {}

    var vis = this;

    for(let i=0;i<vis.happinessData.length;i++){
        let data = vis.happinessData;
        countryHappinessDict[data[i]["Country"]] = data[i]["Happiness_Score"]
    }
    let data = vis.auxiliaryData
    let newData = []
    for(let i=0;i<data.length;i++){
        if(countryHappinessDict[data[i].countries]!= undefined && data[i].hf_score>0 && data[i].year=="2015"){
            let country = {country: data[i].countries, region: data[i].region, hf_score: +data[i].hf_score, happiness: +countryHappinessDict[data[i].countries]}
            newData.push(country)
        }
    }
    console.log("Freedom Data")
    console.log(newData)
    vis.data = newData

    vis.xScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function (d) { return d.hf_score-.1 }), d3.max(vis.data, function (d) { return d.hf_score; }) + 5]) // input
        .range([vis.padding / 2, vis.width]); // output


    vis.yScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function (d) { return d.happiness; }) - 3, d3.max(vis.data, function (d) { return d.happiness; }) + 3]) // input
        .range([vis.height - vis.padding / 2, vis.padding / 2]); // output
    // Update the visualization
    vis.updateVis();
}

FreedomIndexChart.prototype.updateVis = function () {

    var vis = this;
    // Analyze the dataset in the web console

    //this is where I should deal with all stuff.

    //Convert numerical values to numbers

    let padding = 20;
    svg = vis.svg

    svg.selectAll("*").remove();

    svg.selectAll("circle")
        .data(vis.data) // parse through our data
        .enter()
        .append("circle") // create place holder each data item and replace with rect
        .style("fill", function (d) { return vis.colorPalette(d.region); })
        .attr("r",3)
        .attr("cx", function(d) { return vis.xScale(d.hf_score); }) 
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
        .text('Freedom Score')
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