




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




// function idled() {
//     idleTimeout = null;
// }

// function zoom() {
//     var vis = this;
//     var t = scatter.transition().duration(750);
//     vis.svg.select("#axis--x").transition(t).call(xAxis);
//     vis.svg.select("#axis--y").transition(t).call(yAxis);
//     scatter.selectAll("circle").transition(t)
//     .attr("cx", function (d) { return x(d.x); })
//     .attr("cy", function (d) { return y(d.y); });
// }
/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
LineGraphTemplate.prototype.tooltip_render = function (tooltip_data) {
    var vis = this;
    var text = "<ul>";
    //tooltip_data.forEach(function(row) {
    text += "<li>" + "<h3>" + " " + "\t\t" + tooltip_data.Country + "</h3>" + "</li>" + "<li>" + vis.xlabel + ":\t\t" + tooltip_data[vis.x] + "</li><li>Region" + ":\t\t" + tooltip_data.Region + "" + "</li>"
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

    tip_1 = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function () {
            return [0, 0];
        }).html(function (event, d, state) {


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
        }).on('mouseover',
            function (event, d) {
                tip_1.show(event, d);
                console.log(d)
                d3.select(event.currentTarget).attr("class", "selected")
            })
        .on('mouseout',
            function (event, d) {
                tip_1.hide();
                d3.select(event.currentTarget).attr("class", null)
            })
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

    //     vis.clip = vis.svg.append("defs").append("clipPath")
    //     .attr("id", "clip")
    //     .append("svg:rect")
    //     .attr("width", vis.width - 70)
    //     .attr("height", vis.height - vis.padding*2)
    //     .attr("x", 0)
    //     .attr("y", 0);
    //     vis.scatter = vis.svg.append('g')
    //     .attr("clip-path", "url(#clip)")
    //     .lower()
    

    // vis.brush = d3.brushX()                 // Add the brush feature using the d3.brush function
    //     .extent([[0, 0], [vis.width, vis.height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //     .on("end", (event, d) => vis.brushChart(event))

    // vis.scatter
    //     .append("g")
    //     .attr("class", "brush")
    //     .call(vis.brush);

    // vis.idleTimeout;



}

// LineGraphTemplate.prototype.brushChart = function (event) {
//     let vis = this
//     extent = event.selection
//     console.log("hello???")
//     // If no selection, back to initial coordinate. Otherwise, update X axis domain
//     if (!extent) {
//         if (!vis.idleTimeout) return vis.idleTimeout = setTimeout(vis.idleTimeout = null, 350); 
//         vis.xScale.domain([d3.min(vis.displayData, function (d) { return d[vis.x] - ((1 / 2) * d[vis.x]); }), d3.max(vis.displayData, function (d) { return d[vis.x] + ((1 / 2) * d[vis.x]); })])
//     } else {
//         vis.xScale.domain([vis.xScale.invert(extent[0]), vis.xScale.invert(extent[1])])
//         vis.scatter.select(".brush").call(vis.brush.move, null) 
//     }

//     // Update axis and circle position
//     vis.xGroup.transition().duration(1000).call(d3.axisBottom(vis.xScale))
//     vis.svg
//         .selectAll("circle")
//         .transition().duration(1000)
//         .attr("cx", function (d) { return vis.xScale(d[vis.x]); })
//         .attr("cy", function (d) { return vis.yScale(d[vis.y]); })

// }







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