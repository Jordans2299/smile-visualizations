DonutGraph = function (_parentElement, _labelParent, _country, _data) {

    this.parentElement = _parentElement;
    this.labelParent = _labelParent
    this.country = _country;
    this.data = _data
    this.width = 400,
        this.height = 400;
    this.initVis();
}


/*
 *  Initialize station map
 */

DonutGraph.prototype.initVis = function () {
    var vis = this;
    vis.svg = d3.select("#" + vis.parentElement)
    vis.labelsvg = d3.select("#" +vis.labelParent)
    var domain = ["Agriculture, Forestry, Fishing", "Services", "Industry", "Manufacturing"]
    var range = ["#79d96b", "#5dc8e5", "#db5de5", "#e5a35d"]
    var newArray = domain.map((e, i) => [e, range[i]])
    var size = 20
    vis.labelsvg.selectAll("mydots")
    .data(newArray)
    .enter()
    .append("rect")
    .attr("x", -10)
    .attr("y", function(d, i) { return 150 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d) { return d[1] })

// Add one dot in the legend for each name.
    vis.labelsvg.selectAll("mylabels")
    .data(newArray)
    .enter()
    .append("text")
    .attr("x", (size * 1.2)-10)
    .attr("y", function(d, i) { return 150 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d) { return d[1] })
    .text(function(d) { return d[0] })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

    vis.colorPalette = vis.colorScale = d3.scaleOrdinal()
        .domain(domain).range(range);

    vis.wrangleData();

}


/*
 *  Data wrangling
 */

DonutGraph.prototype.wrangleData = function () {
    var vis = this;

    vis.displayData = vis.data;
    // Update the visualization
    vis.updateVis();

}
DonutGraph.prototype.tooltip_render = function (tooltip_data) {
    var vis = this;
    var text = "<ul>";
    //tooltip_data.forEach(function(row) {
    text += "<li>" + "<h3>" + " " + "\t\t" + tooltip_data.data.industry + "</h3>" + "</li>" + "<li>"  + tooltip_data.value.toFixed(2) + "%" + "</li>"
    //});

    return text;
}


/*
 *  The drawing function
 */
DonutGraph.prototype.updateVis = function () {
    var vis = this
    vis.svg.selectAll("*").remove()
    tip_1 = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function () {
            return [0, 0];
        }).html(function (event, d, state) {
            return vis.tooltip_render(d);
        });

    self.svg.call(tip_1);

    /*Help with creating d3 donut from https://www.d3-graph-gallery.com/graph/donut_basic.html*/
    var radius = Math.min(vis.width, vis.height) / 3
    var pied = d3.pie()
        .value(function (d) { return d.value; })
    var data_ready = pied(vis.data)
    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)
    var arc = d3.arc()
        .innerRadius(100)         // This is the size of the donut hole
        .outerRadius(radius)
    vis.svg
        .selectAll('.pie')
        .data(data_ready)
        .enter()
        .append('path')
        .attr("class", "pie")
        .attr("transform", "translate(200,200)")
        .attr('d', d3.arc()
            .innerRadius(100)         // This is the size of the donut hole
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (vis.colorScale(d.data.industry)) })
        .attr("stroke", function (d) { return (vis.colorScale(d.data.industry)) })
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .on('mouseover',
            function (event, d) {
                tip_1.show(event, d);
                console.log("Pie chart data" + d)
                d3.select(event.currentTarget).attr("class", "selected")
            })
        .on('mouseout',
            function (event, d) {
                tip_1.hide();
                d3.select(event.currentTarget).attr("class", null)
            })





    let countryText = document.getElementById("country-economy-text")
    countryText.innerHTML = vis.country
}