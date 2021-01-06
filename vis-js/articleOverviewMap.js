ArticleOverviewMap = function(_parentElement, _textElement, _data, _accompaniment) {

    this.parentElement = _parentElement;
    this.textElement = _textElement;
    this.accompaniment=_accompaniment
    this.data = _data;
    this.width = 800,
    this.height = 400;
    this.initVis();
}


/*
 *  Initialize station map
 */

ArticleOverviewMap.prototype.initVis = function() {
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

    // let title = vis.svg.append("g")
    // .attr("transform", "translate(0,395)")

    // title.append("text")
    // .text("Happiness Index Legend")
    
    // var legend = d3.legendColor()
    //     .labelFormat(d3.format(".2f"))
    //     .useClass(false)
    //     .scale(vis.colorScale)
    
    // legendQuant
    //   .call(legend);



    /*
        vis.svg.append("g")
            .attr("class", "legendQuantile")
            .call(legendQuantile)
    */

}


/*
 *  Data wrangling
 */

ArticleOverviewMap.prototype.wrangleData = function() {
    var vis = this;
    vis.displayData = vis.data;
    var vis = this;
    vis.displayData = vis.data;
    vis.data.forEach(function (d) {
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
        d["Agriculture_Fishing_Forestry_Value__Percent"] = +d["Agriculture_Fishing_Forestry_Value__Percent"]
        d["Services_Value_Percent"] = +d["Services_Value_Percent"]
        d["Industry_Value_Percent"] = +d["Industry_Value_Percent"]
        d["Manufacturing_Value_Percent"] = +d["Manufacturing_Value_Percent"]
    })
    // Update the visualization
    vis.updateVis();

}

/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
ArticleOverviewMap.prototype.tooltip_render = function(tooltip_data) {
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

ArticleOverviewMap.prototype.updateVis = function() {
    var vis = this;

    var projection = d3.geoMercator()
        .translate([150+(vis.width / 3.5), 150+(vis.height / 4)]);

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
                            if (vis.accompaniment=="statswheel") {
                            vis.updateStatsWheel(result[0])
                            }
                            else {
                                vis.updateDonut(result[0])
                            }
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

ArticleOverviewMap.prototype.updateStatsWheel = function(d) {
    var vis = this
    var country= d.Country
    console.log("economy: " + d["Economy (GDP per Capita)"])
    let economy = d["Economy (GDP per Capita)"]
    let family = d["family"]
    let health = d["Health (Life Expectancy)"]
    let freedom = d["Freedom"]
    let trust = d["Trust (Government Corruption)"]
    let generosity = d["Generosity"]
    let dystopia = d["Dystopia Residual"]
    var nodes = [
        {id: 1, index: 0, metric: "Economy", item: economy , cx:200, cy:100},
        {id: 2, index: 1, metric: "Family", item:family, cx:122, cy:138},
        {id: 3, index:2, metric: "Health", item:health, cx: 103, cy: 222},
        {id: 4, index:3, metric: "Freedom", item:freedom, cx: 157, cy: 290},
        {id: 5, index: 4, metric: "Trust", item:trust , cx: 243, cy: 290},
        {id: 6, index: 5, metric: "Generosity", item:generosity, cx:297, cy:222},
        {id: 7, index: 6, metric: "Dystopia Residual", item: dystopia, cx:278, cy:138}
    ]
    //Coordinate help from https://www.mathopenref.com/coordpolycalc.html
    var links = [
        {index: 0, x1:"200", x2:"122", y1:"100", y2: "138"},
        {index:1, x1:"122", x2:"103", y1:"138", y2: "222"},
        {index:2, x1:"103", x2:"157", y1:"222", y2: "290"},
        {index: 3, x1:"157", x2:"243", y1:"290", y2: "290"},
        {index: 4, x1:"243", x2:"297", y1:"290", y2: "222"},
        {index: 5, x1:"297", x2:"278", y1:"222", y2: "138"},
        {index: 6, x1:"278", x2:"200", y1:"138", y2: "100"}

    ]
    vis.statsWheel = new StatsWheel("happiest_anatomy_analysis", country, nodes, links)

}
ArticleOverviewMap.prototype.updateDonut = function(d) {
    var vis = this;
    var data = [
        {index: 0, industry:"Agriculture, Forestry, Fishing", value: d["Agriculture_Fishing_Forestry_Value__Percent"]},
        {index: 1, industry: "Services", value: d["Services_Value_Percent"]},
        {index: 2, industry: "Industry", value: d["Industry_Value_Percent"] },
        {index: 3, industry: "Manufacturing", value: d["Manufacturing_Value_Percent"]}

    ]
    vis.donut = new DonutGraph("economy-breakdown", d.Country, data)
}
