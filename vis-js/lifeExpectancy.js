LifeExpectancyChart = function(_parentElement, _happinessData, _auxiliaryData) {

    this.parentElement = _parentElement;
    this.happinessData = _happinessData;
    this.auxiliaryData = _auxiliaryData;
    this.width = 700,
        this.height = 500;
    this.initVis();
}


/*
 *  Initialize station map
 */

LifeExpectancyChart.prototype.initVis = function() {
    var vis = this;
    var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
        "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
        "Southern Asia"
    ]
    var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
    vis.colorPalette = vis.colorScale = d3.scaleOrdinal()
        .domain(domain).range(range);

    vis.svg = d3.select("#" + vis.parentElement)
    vis.padding = 20;
    vis.wrangleData();
}


/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
LifeExpectancyChart.prototype.tooltip_render = function(tooltip_data) {
    var self = this;
    var text = "<ul>";
    //tooltip_data.forEach(function(row) {
    text += "<li>" + "<h3>" + " " + "\t\t" + tooltip_data.Country + "</h3>" + "</li>" + "<li>" + " Life expectancy" + ":\t\t" + tooltip_data.Life_expectancy + "</li><li> Family Number: " + "\t\t" + tooltip_data.Family + "</li><li>Region" + ":\t\t" + tooltip_data.Region + "" + "</li>"
        //});

    return text;
}



/*
 *  Data wrangling
 */

LifeExpectancyChart.prototype.wrangleData = function() {
    var vis = this;


    vis.happinessData.forEach(function(d) {
        //d["LifeExpectancy"] = +d["LifeExpectancy"]; // transform each d.value from str to int
        //d["Income"] = +d["Income"];
        //d["Population"] = +d["Population"];
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
    });

    function matchCountry(dataPoint, name) {
        return dataPoint.Country === name;
    }
    // Currently no data wrangling/filtering needed
    vis.auxiliaryData.forEach(function(d) {
        d["Life_expectancy "] = +d["Life_expectancy "]
    })

    for (let i = 0; i < vis.happinessData.length; ++i) {
        countryName = vis.happinessData[i].Country
        let obj = vis.auxiliaryData.find(country => country.Country === countryName);
        if (obj != null) {
            console.log("Final result" + obj["Life_expectancy "])
            vis.happinessData[i].Life_expectancy = obj["Life_expectancy "]
        }

        // if true is returned, item is returned and iteration is stopped
        // for falsy scenario returns undefined

    }
    vis.data = vis.happinessData
    console.log(vis.data)

    vis.xScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function(d) { return d.Life_expectancy; }) - 5, d3.max(vis.data, function(d) { return d.Life_expectancy; }) + 5]) // input
        .range([vis.padding / 2, vis.width]); // output


    vis.yScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function(d) { return d["Happiness_Score"]; }) - 3, d3.max(vis.data, function(d) { return d["Happiness_Score"]; }) + 3]) // input
        .range([vis.height - vis.padding / 2, vis.padding / 2]); // output
    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */

LifeExpectancyChart.prototype.updateVis = function() {

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


            console.log("LLLLL");
            //console.log(tooltip_data.result);
            /*
            if (tooltip_data.result[0].nominee === "") {
                tooltip_data.result.splice(0, 1);
            }
            console.log("LLLLL");
            */
            return vis.tooltip_render(d);
        });

    svg.selectAll("*").remove();


    self.svg.call(tip_1);



    svg.selectAll("circle")
        .data(vis.data) // parse through our data
        .enter()
        .append("circle") // create place holder each data item and replace with rect
        .style("fill", function(d) { return vis.colorPalette(d.Region); })
        .attr("r", 3)
        .attr("cx", function(d) {
            if (d.Life_expectancy != null) {
                console.log(d.Country + " " + d.Life_expectancy + " " + vis.xScale(d.Life_expectancy))
                return vis.xScale(d.Life_expectancy);
            }
            return;
        }) // use xScale to find x position 
        .attr("cy", function(d) {
            if (d.Life_expectancy != null) {
                return vis.yScale(d["Happiness_Score"]);
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
        .attr("transform", "translate(0," + (vis.height - 1.5 * vis.padding) + ")")

    .call(xAxis)

    .append('text')
        .attr("fill", "black")
        .text('Life Expectancy (years)')
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