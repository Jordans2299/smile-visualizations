StatsWheel = function (_parentElement, _country, _nodes, _links) {

  this.parentElement = _parentElement;
  this.country = _country;
  this.nodes = _nodes;
  this.links = _links;
  this.width = 400,
    this.height = 400;
  this.initVis();
}


/*
 *  Initialize station map
 */

StatsWheel.prototype.initVis = function () {
  var vis = this;
  vis.svg = d3.select("#" + vis.parentElement)
  var domain = ["Economy", "Family", "Health", "Freedom",
    "Trust", "Generosity", "Dystopia Residual"]
  var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975"]
  vis.colorPalette = vis.colorScale = d3.scaleOrdinal()
    .domain(domain).range(range);

    
  vis.wrangleData();

}


/*
 *  Data wrangling
 */

StatsWheel.prototype.wrangleData = function () {
  var vis = this;
  var totalSum = 0;
  vis.nodes.forEach(function (d) {
    if (d.item == null) {
      d.item=0
    }
    totalSum+=d.item
})
// U
  vis.nodes.forEach(function (d) {
    d.proportion=parseFloat(d.item)/totalSum
  })
  console.log(vis.nodes)
  
  vis.displayData = vis.data;
  // Update the visualization
  vis.updateVis();

}


/*
 *  The drawing function
 */
StatsWheel.prototype.updateVis = function () {
  var vis = this
  vis.svg.selectAll("*").remove()
  var edgesDisplay = vis.svg.selectAll("line")
    .data(vis.links)
    .enter()
    .append("line")
    .attr("x1", function(d) {
      return d.x1
    })
    .attr("x2", function(d) {
      return d.x2
    })
    .attr("y1", function(d) {
      return d.y1
    })
    .attr("y2", function(d) {
      return d.y2
    })
    .style("stroke-width", 1)
    .style("stroke", "black")
  //From Studio 7
  var nodeDisplay = vis.svg.selectAll("circle")
    .data(vis.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("cx", function(d) {
      return d.cx;
    })
    .attr("cy", function(d) {
      return d.cy
    })
    .attr("r", function (d) {
      return d.proportion * 50;
    })
    .attr("fill", function (d) {
      return vis.colorScale(d.metric)
    })

  let labels = vis.svg.selectAll("text")
    .data(vis.nodes);
  labels.enter()
    .append("text")
    .attr("class", "label")
    .attr("id", function(d){
      return "label-" +d.index
    })
    .attr("x", function(d) {
      if(d.index > 0 && d.index < 4) {
        return d.cx - 60
      }
      else if(d.index >= 4) {
        return d.cx + 30
      }
      return d.cx-20
    })
    .attr("y", function(d) {
      if(d.index ==0) {
        return d.cy-20
      }
      return d.cy
    })
    .text(function (d) {
      return d.metric;
    });
 

let countryText = document.getElementById("country-text")
countryText.innerHTML=vis.country


}