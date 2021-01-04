StatsWheel = function(_parentElement, _country, _nodes, _links) {

    this.parentElement = _parentElement;
    this.country=_country;
    this.nodes = _nodes;
    this.links = _links;
    this.width = 400,
    this.height = 400;
    this.initVis();
}


/*
 *  Initialize station map
 */

StatsWheel.prototype.initVis = function() {
    var vis = this;
    vis.svg = d3.select("#" + vis.parentElement)
    .call(d3.zoom().on("zoom", function (event, d) {
        vis.svg.attr("transform", event.transform)
     }))
    console.log("stats wheel data" + JSON.stringify(vis.nodes) + JSON.stringify(vis.links))
     vis.wrangleData();

}


/*
 *  Data wrangling
 */

StatsWheel.prototype.wrangleData = function() {
    var vis = this;
    vis.displayData = vis.data;
    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */
StatsWheel.prototype.updateVis = function() {
    var vis=this
    // 2b) START RUNNING THE SIMULATION
    var simulation = d3.forceSimulation(vis.nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(vis.links).distance(20))
    .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2));
  
  
    // Draw edges
      // 3) DRAW THE LINKS (SVG LINE)
  var edgesDisplay= vis.svg.selectAll(".link")
  .data(vis.links)
  .enter()
  .append("line")
  .attr("stroke","red")
  .style("stroke-width",1)
  // Draw nodes
   // 4) DRAW THE NODES (SVG CIRCLE)
  var nodeDisplay = vis.svg.selectAll(".node")
          .data(vis.nodes)
          .enter()
          .append("circle")
          .attr("class", "node")
          .attr("r", function(d){
              return d.item*6;
          })
          .attr("fill","purple")

          nodeDisplay.append("title")
          .text(function(d) { return d.name; })
  
          function dragStarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
          
          function dragging(event, d) {
            d.fx = event.x;
            d.fy = event.y;
          }
          
          function dragEnded(event, d) {
            if (event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }
          nodeDisplay.call(d3.drag()
          .on("start", (event,d)=> dragStarted(event,d))
          .on("drag", (event,d)=>dragging(event,d))
          .on("end", (event,d)=>dragEnded(event,d)));
    // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
  simulation.on("tick", function() {
  
            // Update node coordinates
            nodeDisplay
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        
            // Update edge coordinates
            edgesDisplay.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
  
    });



}