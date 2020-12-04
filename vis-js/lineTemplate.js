LineGraphTemplate = function(_parentElement, _data, _x, _y, _xlabel, _ylabel) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.x=_x
    this.y=_y
    this.xlabel=_xlabel
    this.ylabel=_ylabel
    this.width = 700,
    this.height = 500;
    this.initVis();
}


/*
 *  Initialize station map
 */

LineGraphTemplate.prototype.initVis = function() {
    var vis = this;

    var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
        "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
        "Southern Asia"
    ]
    var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
    vis.colorPalette = vis.colorScale = d3.scaleOrdinal()
        .domain(domain).range(range);

    vis.svg = d3.select("#" + vis.parentElement)
    vis.padding = 40;
    vis.makeDataReadable();
}


/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
LineGraphTemplate.prototype.tooltip_render = function(tooltip_data) {
    var self = this;
    var text = "<ul>";
    //tooltip_data.forEach(function(row) {
    text += "<li>" + "<h3>" + " " + "\t\t" + tooltip_data.Country + "</h3>" + "</li>" + "<li>" + " Life expectancy" + ":\t\t" + tooltip_data.Life_expectancy + "</li><li> Family Number: " + "\t\t" + tooltip_data.Family + "</li><li>Region" + ":\t\t" + tooltip_data.Region + "" + "</li>"
        //});

    return text;
}


LineGraphTemplate.prototype.makeDataReadable=function() {
    var vis = this;
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

LineGraphTemplate.prototype.wrangleData = function() {
    var vis= this;
    let finalData = vis.data.filter(d=>d[vis.x]!=0)
    console.log(finalData)
    vis.displayData= finalData

    vis.xScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.displayData, function(d) { return d[vis.x]; }), d3.max(vis.displayData, function(d) { return d[vis.x]; })]) // input
        .range([vis.padding, vis.width]); // output


    vis.yScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.displayData, function(d) { return d[vis.y]; }), d3.max(vis.displayData, function(d) { return d[vis.y]; })]) // input
        .range([vis.height - vis.padding / 2, vis.padding]); // output


    vis.updateVis();

}


/*
 *  The drawing function
 */

LineGraphTemplate.prototype.updateVis = function() {

    var vis = this;
    // Analyze the dataset in the web console

    //this is where I should deal with all stuff.

    //Convert numerical values to numbers

    //vis.tooltip_render(vis.happinessData);

    let padding = 20;
    svg = vis.svg

    tip_1 = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function() {
            return [0, 0];
        }).html(function(event, d, state) {


            //console.log("LLLLL");
            ////console.log(tooltip_data.result);
            /*
            if (tooltip_data.result[0].nominee === "") {
                tooltip_data.result.splice(0, 1);
            }
            //console.log("LLLLL");
            */
            return vis.tooltip_render(d);
        });

    svg.selectAll("*").remove();


    self.svg.call(tip_1);



    svg.selectAll("circle")
        .data(vis.displayData) // parse through our data
        .enter()
        .append("circle") // create place holder each data item and replace with rect
        .style("fill", function(d) { return vis.colorPalette(d.Region); })
        .attr("r", 3)
        .attr("cx", function(d) {
            if (d[vis.x] != null) {
                console.log(d.Country + " " + d[vis.x] + " " + vis.xScale(d[vis.x])+ " " + vis.x)
                return vis.xScale(d[vis.x]);
            }
            return;
        }) // use xScale to find x position 
        .attr("cy", function(d) {
            if (d[vis.y] != null) {
                return vis.yScale(d[vis.y]);
            }
            return;
        }).on('mouseover',
            (event, d) => tip_1.show(event, d))
        .on('mouseout', function(event, d) {
            tip_1.hide();
        }); // use yScale to find y position





    // Create an axis function specifying orientation (top, bottom, left, right)
    let xAxis = d3.axisBottom();

    // Pass in the scale function
    xAxis.scale(vis.xScale)

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (vis.height - 0.8 * vis.padding) + ")")

    .call(xAxis)

    .append('text')
        .attr("fill", "black")
        .text(vis.xlabel)
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

LineGraphTemplate.prototype.onSelectionChange= function(selection, x_label) {
    let vis = this
    vis.x=selection
    vis.xlabel = x_label
    vis.wrangleData();

}