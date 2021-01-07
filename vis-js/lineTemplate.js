




LineGraphTemplate = function (_parentElement, _data, _x, _y, _xlabel, _ylabel, _region) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.x = _x
    this.y = _y
    this.xlabel = _xlabel
    this.ylabel = _ylabel
    this.region = _region
    this.width = 750,
    this.height = 500;
    this.initVis();
}


/*
 *  Initialize station map
 */



LineGraphTemplate.prototype.initVis = function () {
    var vis = this;

    var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
        "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
        "Southern Asia"
    ]
    var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
    vis.colorPalette = vis.colorScale = d3.scaleOrdinal()
        .domain(domain).range(range);
    var legendOrdinal = d3.legendColor()
        .scale(vis.colorPalette);

    vis.svg = d3.select("#" + vis.parentElement)
    vis.svg.select(".legendOrdinal")
        .call(legendOrdinal);
    vis.padding = 40;
    vis.makeDataReadable();
}



/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
LineGraphTemplate.prototype.tooltip_render = function (tooltip_data) {
    var vis = this;
    var text = "<ul>";
    console.log("tooltip data:")
    console.log(tooltip_data)
    console.log(vis.x)
    console.log(vis.xlabel)
    //tooltip_data.forEach(function(row) {
    text += "<li>" + "<h3>" + " " + "\t\t" + tooltip_data.Country + "</h3>" + "</li>" + "<li>" + vis.xlabel + ":\t\t" + tooltip_data[vis.x] + "</li>"+"<li>Region" + ":\t\t" + tooltip_data.Region + "" + "</li>"
    //});

    return text;
}


LineGraphTemplate.prototype.makeDataReadable = function () {
    var vis = this;
    vis.data.forEach(function (d) {
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
        d["Poverty_Rate"] = +d["Poverty_Rate"]
        d["GDP_Growth_Annual"] = +d["GDP_Growth_Annual"]
        d["DALYs (Disability-Adjusted Life Years)_AllCauses"] = +d["DALYs (Disability-Adjusted Life Years)_AllCauses"]
        d["Physician_Presence"] = +d["Physician_Presence"]
        d["Child_Mortality_Under_5"] = +d["Child_Mortality_Under_5"]
        d["Undernourishment_Prevalence_percent"] = +d["Undernourishment_Prevalence_percent"]
        d["Avg_Household_Size"] = +d["Avg_Household_Size"]
        d["Unemployment_Total_Percent"] = +d["Unemployment_Total_Percent"]
        d["Adolescent_Fertility_Rate"] = +d["Adolescent_Fertility_Rate"]
        d["Hygiene_Mortality_Rate"] = +d["Hygiene_Mortality_Rate"]
        d["Electricity_Access_Percent"] = +d["Electricity_Access_Percent"]
        d["Air_Pollution_Mortality"] = +d["Air_Pollution_Mortality"]
        d["Basic_Sanitation_Percent"] = +d["Basic_Sanitation_Percent"]
        d["Inflation_Consumer_Percent"] = +d["Inflation_Consumer_Percent"]
        d["Exports of goods and services (% of GDP)"] = +d["Exports of goods and services (% of GDP)"]
        d["Adjusted savings: natural resources depletion (% of GNI)"] = +d["Adjusted savings: natural resources depletion (% of GNI)"]
        d["Adjusted savings: education expenditure (% of GNI)"] = +d["Adjusted savings: education expenditure (% of GNI)"]
        d["Adjusted savings: carbon dioxide damage (% of GNI)"] = +d["Adjusted savings: carbon dioxide damage (% of GNI)"]


    });
    vis.wrangleData();

}

/*
 *  Data wrangling
 */

LineGraphTemplate.prototype.wrangleData = function () {
    var vis = this;

    let finalData = vis.data.filter(d => d[vis.x] != 0)
    let finalDataRegion = finalData
    if (vis.region != "All") {
        finalDataRegion = vis.data.filter(d => d["Region"] == vis.region)
    }

    vis.displayData = finalDataRegion

    vis.xScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.displayData, function (d) { return d[vis.x] - ((1 / 2) * d[vis.x]); }), d3.max(vis.displayData, function (d) { return d[vis.x] + ((1 / 2) * d[vis.x]); })]) // input
        .range([vis.padding, vis.width]); // output


    vis.yScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.displayData, function (d) { return d[vis.y] - ((1 / 4) * d[vis.y]); }), d3.max(vis.displayData, function (d) { return d[vis.y] + ((1 / 4) * d[vis.y]); })]) // input
        .range([vis.height - vis.padding / 2, vis.padding]); // output

    vis.updateVis();

}


/*
 *  The drawing function
 */

LineGraphTemplate.prototype.updateVis = function () {
    var vis = this;
    svg = vis.svg

    svg.selectAll("*").remove();
    vis.div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);



    vis.svg.selectAll("circle")
        .data(vis.displayData) // parse through our data
        .enter()
        .append("circle") // create place holder each data item and replace with rect
        .style("fill", function (d) { return vis.colorPalette(d.Region); })
        .attr("r", 3)
        .attr("class", "dot")
        .attr("cx", function (d) {
            if (d[vis.x] != null) {
                console.log(d.Country + " " + d[vis.x] + " " + vis.xScale(d[vis.x]) + " " + vis.x)
                return vis.xScale(d[vis.x]);
            }
            return;
        }) // use xScale to find x position 
        .attr("cy", function (d) {
            if (d[vis.y] != null) {
                return vis.yScale(d[vis.y]);
            }
            return;
        })
        //Help with tooltips that wouldn't interfere with each other on 
        //least happiest from https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
        .on('mouseover',
            function (event, d) {
                vis.div	
                .style("opacity", .9);		
                vis.div.html("<h3>" + " " + "\t\t" + d.Country + "</h3>" + "<ul>" + "<li>" + vis.xlabel + ":\t\t" + d[vis.x] + "</li>"+"<li>Region" + ":\t\t" + d.Region + "" + "</li>" )	
                .style("left", (event.pageX) + "px")		
                .style("top", (event.pageY - 15) + "px");	
                d3.select(event.currentTarget).attr("class", "selected")
            })
        .on('mouseout',
            function (event, d) {
                vis.div	
                .style("opacity", 0);	
                d3.select(event.currentTarget).attr("class", null)
            })
            //End of help from tooltip citation above
        .on("click", function (event, d) {

            vis.svg.selectAll("circle")
                .style("fill", function (d) {
                    return vis.colorPalette(d.Region);
                }).attr("r", 3);

            //svg.selectAll("#selected").text(d.properties.name);
            d3.select(event.currentTarget)
                .transition(500)
                .style("fill", "#FAED26")
                .attr("r", 10);
            //if(set_of_nations.has(d.properties.name)){
            //setUpCountries(d.properties.name);
            //}
            //console.log(d);
        }).on("dblclick",
            function (d) {
                vis.svg.selectAll("path")
                    .style("fill", function (d) {
                        return vis.colorPalette(d.Region);
                    }).attr("r", 3);

            });; // use yScale to find y position





    // Create an axis function specifying orientation (top, bottom, left, right)
    vis.xAxis = d3.axisBottom();

    // Pass in the scale function
    vis.xAxis.scale(vis.xScale)

    // Draw the axis
    vis.xGroup = vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (vis.height - 0.6 * vis.padding) + ")")

        .call(vis.xAxis)

        .append('text')
        .attr("fill", "black")
        .text(vis.xlabel)
        .attr("x", 590)
        .attr("y", 0)


    vis.yAxis = d3.axisLeft();

    // Pass in the scale function
    vis.yAxis.scale(vis.yScale);

    // Draw the axis
    vis.yGroup = vis.svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + (vis.padding) + ",0)")
        .call(vis.yAxis)
        .append('text')
        .attr("fill", "black")
        .text('Happiness Score')
        .attr("x", 80)
        .attr("y", 48);


    //only draw trend line if there is a sufficient amount of data points
    if(vis.displayData.length > 50){
        
        // get the x and y values for least squares
		let xSeries = vis.data.map(function(d) { 
            if(isNaN(d[vis.x])){
                return 0;
            }
            return +d[vis.x]; });
        let ySeries = vis.data.map(function(d) { return +d[vis.y] });

        console.log("xseries: ")
        console.log(xSeries)
        
	    let xScale = d3.scaleLinear()
		.range([vis.padding, vis.width]);
		
	    let yScale = d3.scaleLinear()
        .range([vis.height-vis.padding, vis.padding]);
        
        let leastSquaresCoeff = leastSquares(xSeries, ySeries);


        let slope = leastSquaresCoeff[0]
        let intercept = leastSquaresCoeff[1]
        let rSquared = leastSquaresCoeff[2]
    
        //apply the reults of the least squares regression
        // console.log("Min: "+d3.min(xSeries, function(d) { return d}))
        // console.log("Min Scaled: "+vis.xScale(d3.min(xSeries, function(d) { return d})))
        let x1 = 0
		let y1 = intercept;
		let x2 = d3.max(xSeries, function(d) { return d})
        let y2 = slope * x2+ intercept;

        console.log("slope "+slope)
        console.log("intercept"+ intercept)
        let trendData = [[x1,y1,x2,y2]];
        

        var trendline = svg.selectAll(".trendline")
        .data(trendData);
        
        trendline.enter()
            .append("line")
            .attr("class", "trendline")
            .attr("x1", 40)
            .attr("y1", function(d) { 
                return vis.yScale(+d[1]); })
            .attr("x2", function(d) { return vis.xScale(d[2]); })
            .attr("y2", function(d) { return vis.yScale(d[3]); })
            .attr("stroke", "black")
            .attr("stroke-width", 1);
    }
}




LineGraphTemplate.prototype.onSelectionChange = function (selection, x_label) {
    let vis = this
    vis.x = selection
    vis.xlabel = x_label
    vis.wrangleData();

}
LineGraphTemplate.prototype.filterRegion = function (selection) {
    let vis = this
    vis.region = selection
    vis.wrangleData();

}

//function from http://bl.ocks.org/benvandyke/8459843
function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function(prev, cur) { return prev + cur; };
    
    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
        .reduce(reduceSumFunc);
    
    var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
        .reduce(reduceSumFunc);
        
    var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
        .reduce(reduceSumFunc);
        
    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
    
    return [slope, intercept, rSquare];
}