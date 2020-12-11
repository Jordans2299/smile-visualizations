ContinentMap = function(_parentElement, _data) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.width = 1000,
        this.height = 600;

    this.initVis();
}


/*
 *  Initialize station map
 */

ContinentMap.prototype.initVis = function() {
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

ContinentMap.prototype.wrangleData = function() {
    var vis = this;
    vis.displayData = vis.data;


    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */

ContinentMap.prototype.updateVis = function() {
    var vis = this;


    var projection = d3.geoMercator()
        .translate([vis.width / 2.2, vis.height / 1.5]);

    var path = d3.geoPath()
        .projection(projection);

    d3.json("data/world-countries.json").then(function(world) {
        console.log(world);
    });

    d3.json("data/continents.json").then(function(world) {

        console.log(world);
        vis.svg
            .selectAll("path")
            .data(world.features)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) {
                /*
                let countryName = d.properties.name;
                var result = vis.data.filter(country => {
                    return country.Country == countryName
                })
                if (result.length == 1) {
                    return vis.colorScale(result[0].Happiness_Score);
                } // get rate value for property matching data ID
                return "#808080";
                // pass rate value to color function, return color based on domain and range
                */
                console.log("aaaaa");
                return "lightgreen";
            })
            .on("click", function(event, d) {

                d3.selectAll("path")
                    .style("fill", function(d) {

                        return "lightgreen";
                        // }
                    });

                //svg.selectAll("#selected").text(d.properties.name);
                d3.select(event.currentTarget)
                    .transition(500)
                    .style("fill", "darkred");
                //if(set_of_nations.has(d.properties.name)){
                //setUpCountries(d.properties.name);
                //}
                //console.log(d);
            }).on("dblclick",
                function(d) {
                    d3.selectAll("path")
                        .style("fill", function(d) {

                            return "lightgreen";
                            // }
                        });
                });


    });


}