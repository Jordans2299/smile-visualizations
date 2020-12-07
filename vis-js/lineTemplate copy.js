LineGraphTemplate = function(_parentElement, _data, _x, _y, _xlabel, _ylabel) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.x = _x
    this.y = _y
    this.xlabel = _xlabel
    this.ylabel = _ylabel
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


LineGraphTemplate.prototype.makeDataReadable = function() {
    var vis = this;
    vis.data.forEach(function(d) {
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
    var vis = this;
    let finalData = vis.data.filter(d => d[vis.x] != 0)
    console.log(finalData)
    vis.displayData = finalData

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



    let circles = svg.selectAll("circle")
        .data(vis.displayData) // parse through our data
        .enter()
        .append("circle") // create place holder each data item and replace with rect
        .style("fill", function(d) { return vis.colorPalette(d.Region); })
        .attr("r", 3)
        .attr("cx", function(d) {
            if (d[vis.x] != null) {
                console.log(d.Country + " " + d[vis.x] + " " + vis.xScale(d[vis.x]) + " " + vis.x)
                return vis.xScale(d[vis.x]);
            }
            return;
        }) // use xScale to find x position 
        .attr("cy", function(d) {
            if (d[vis.y] != null) {
                return vis.yScale(d[vis.y]);
            }
            return;
        })
        .attr("class", "non_brushed") //Brushed
        .on('mouseover',
            (event, d) => tip_1.show(event, d))
        .on('mouseout', function(event, d) {
            tip_1.hide();
        })
        .on("click", function(event, d) {

            vis.svg.selectAll("circle")
                .style("fill", function(d) {
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
            function(d) {
                vis.svg.selectAll("path")
                    .style("fill", function(d) {
                        return vis.colorPalette(d.Region);
                    }).attr("r", 3);

            });; // use yScale to find y position


    function highlightBrushedCircles(event) {

        if (event.selection != null) {

            // revert circles to initial style
            circles.attr("class", "non_brushed");

            var brush_coords = d3.brushSelection(this);

            // style brushed circles
            circles.filter(function() {

                    var cx = d3.select(this).attr("cx"),
                        cy = d3.select(this).attr("cy");

                    return isBrushed(brush_coords, cx, cy);
                })
                .attr("class", "brushed");
        }
    }

    function displayTable(event) {

        // disregard brushes w/o selections  
        // ref: http://bl.ocks.org/mbostock/6232537
        if (!event.selection) return;

        // programmed clearing of brush after mouse-up
        // ref: https://github.com/d3/d3-brush/issues/10
        d3.select(this).call(brush.move, null);

        var d_brushed = d3.selectAll(".brushed").data();

        // populate table if one or more elements is brushed
        if (d_brushed.length > 0) {
            clearTableRows();
            d_brushed.forEach(d_row => populateTableRow(d_row))
        } else {
            clearTableRows();
        }
    }

    var brush = d3.brush()
        .on("brush", highlightBrushedCircles)
        .on("end", displayTable);

    svg.append("g")
        .call(brush);




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


    function clearTableRows() {

        hideTableColNames();
        d3.selectAll(".row_data").remove();
    }

    function isBrushed(brush_coords, cx, cy) {

        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];

        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    function hideTableColNames() {
        d3.select("table").style("visibility", "hidden");
    }

    function showTableColNames() {
        d3.select("table").style("visibility", "visible");
    }

    function populateTableRow(d_row) {

        showTableColNames();
        /*
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
        */
        var d_row_filter = [d_row["Happiness Rank"],
            d_row["Happiness_Score"],
            d_row["Family"]
        ];

        d3.select("table")
            .append("tr")
            .attr("class", "row_data")
            .selectAll("td")
            .data(d_row_filter)
            .enter()
            .append("td")
            .attr("align", (d, i) => i == 0 ? "left" : "right")
            .text(d => d);
    }


}

LineGraphTemplate.prototype.onSelectionChange = function(selection, x_label) {
    let vis = this
    vis.x = selection
    vis.xlabel = x_label
    vis.wrangleData();

}