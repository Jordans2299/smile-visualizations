OverviewMap = function(_parentElement, _data) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.width = 1000,
        this.height = 600;
    this.initVis();
}


/*
 *  Initialize station map
 */

OverviewMap.prototype.initVis = function() {
    var vis = this;
    var domain = [2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];
    //Color range for global color scale
    var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000"];
    //Global colorScale to be used consistently by all the charts
    vis.colorScale = d3.scaleThreshold()
        .domain(domain).range(range);

    vis.wrangleData();
    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("height", vis.height)
        .attr("width", vis.width)
        .attr("id", "map-svg")

    vis.colorScale = d3.scaleThreshold()
        .domain(domain).range(range);
    var newArray = domain.map((e,i) => [e,range[i]])
    let legendQuant = vis.svg.append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(0,400)");

    let title = vis.svg.append("g")
    .attr("transform", "translate(0,395)")

    title.append("text")
    .text("Happiness Index Legend")
    
    var legend = d3.legendColor()
        .labelFormat(d3.format(".2f"))
        .useClass(false)
        .scale(vis.colorScale)
    
    legendQuant
      .call(legend);



    /*
        vis.svg.append("g")
            .attr("class", "legendQuantile")
            .call(legendQuantile)
    */

}


/*
 *  Data wrangling
 */

OverviewMap.prototype.wrangleData = function() {
    var vis = this;
    vis.displayData = vis.data;


    // Update the visualization
    vis.updateVis();

}

/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
OverviewMap.prototype.tooltip_render = function(tooltip_data) {
    var vis = this;
    var text = "<ul>";
    //tooltip_data.forEach(function(row) {
    text += "<li>" + "<h3>" + " " + "\t\t" + tooltip_data.Country + "</h3>" + "</li>" + "<li>" + vis.xlabel + ":\t\t" + tooltip_data[vis.x] + "</li><li>Region" + ":\t\t" + tooltip_data.Region + "" + "</li>"
        //});

    return text;
}


/*
 *  The drawing function
 */

OverviewMap.prototype.updateVis = function() {
    var vis = this;

    vis.data.forEach(function(d) {
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

    var projection = d3.geoMercator()
        .translate([vis.width / 2.2, vis.height / 1.5]);

    var path = d3.geoPath()
        .projection(projection);


    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    d3.json("data/world-countries.json").then(function(world) {
        console.log(vis.data[0])
        vis.svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(world, world.objects.countries1).features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) {
                let countryName = d.properties.name;
                var result = vis.data.filter(country => {
                    return country.Country == countryName
                })
                if (result.length == 1) {
                    return vis.colorScale(result[0].Happiness_Score);
                } // get rate value for property matching data ID
                return "#808080";
                // pass rate value to color function, return color based on domain and range
            })
            .on("mouseover", function(event, d) {

                div.transition()
                    .duration(200)
                    .style("opacity", .8);
                div.html(function() {
                        let nameaa = undefined;

                        let countryName = d.properties.name;
                        var result = vis.data.filter(country => {
                            return country.Country == countryName
                        })
                        if (result.length == 1) {
                            nameaa = result[0].Happiness_Score;
                        }

                        return "<h3>" + d.properties.name +
                            "</h3><br/>" +
                            "Happiness Score: " + nameaa;
                    })
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 18) + "px");

                vis.svg.selectAll("path")
                    .transition(500)
                    .style("fill", function(d) {
                        let countryName = d.properties.name;
                        var result = vis.data.filter(country => {
                            return country.Country == countryName
                        })
                        if (result.length == 1) {
                            return vis.colorScale(result[0].Happiness_Score);
                        } // get rate value for property matching data ID
                        return "#808080";
                        // pass rate value to color function, return color based on domain and range
                    })

                //svg.selectAll("#selected").text(d.properties.name);
                d3.select(event.currentTarget)
                    .transition(500)
                    .style("fill", "green");




            })
            .on("mouseout", function(d) {
                vis.svg.selectAll("path")
                    .transition(500)
                    .style("fill", function(d) {
                        let countryName = d.properties.name;
                        var result = vis.data.filter(country => {
                            return country.Country == countryName
                        })
                        if (result.length == 1) {
                            return vis.colorScale(result[0].Happiness_Score);
                        } // get rate value for property matching data ID
                        return "#808080";
                        // pass rate value to color function, return color based on domain and range
                    })

                div.transition()
                    .duration(300)
                    .style("opacity", 0);


            });

    });

}