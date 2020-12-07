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
            .on("click", function(event, d) {

                vis.svg.selectAll("path")
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
                    .style("fill", "green");
                //if(set_of_nations.has(d.properties.name)){
                //setUpCountries(d.properties.name);
                //}
                //console.log(d);
            }).on("dblclick",
                function(d) {
                    vis.svg.selectAll("path")
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
                });

    });

}