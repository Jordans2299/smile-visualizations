CorrelationDisplay = function(_parentElement, _data, _x, _y, width, height) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.x=_x
    this.y=_y
    // this.xlabel=_xlabel
    // this.ylabel=_ylabel
    this.width = width,
    this.height = height;
    this.initVis();
}


/*
 *  Initialize station map
 */

CorrelationDisplay.prototype.initVis = function() {
    var vis = this;

    var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
        "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
        "Southern Asia"]
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
CorrelationDisplay.prototype.tooltip_render = function(tooltip_data) {
    var self = this;
    var text = "<ul>";
    //tooltip_data.forEach(function(row) {
    text += "<li>" + "<h3>" + " " + "\t\t" + tooltip_data.Country + "</h3>" + "</li>" + "<li>" + " Life expectancy" + ":\t\t" + tooltip_data.Life_expectancy + "</li><li> Family Number: " + "\t\t" + tooltip_data.Family + "</li><li>Region" + ":\t\t" + tooltip_data.Region + "" + "</li>"
        //});

    return text;
}


CorrelationDisplay.prototype.makeDataReadable=function() {
    var vis = this;

    vis.data.forEach(function(d){
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

CorrelationDisplay.prototype.wrangleData = function() {
    var vis= this;
    // let finalData = vis.data.filter(d=>d[vis.x]!=0)
    // console.log(finalData)
    // vis.displayData= finalData

    let meanX=0
    let meanY =0
    let stanX=0
    let stanY=0
    let coVar = 0
    for(let i=0;i<vis.data.length;++i){
        meanX+= vis.data[i][vis.x]
        meanY+= +vis.data[i][vis.y]
    }
    meanX /= vis.data.length
    meanY /= vis.data.length
    for(let i=0;i<vis.data.length;++i){
        stanX+= Math.pow(vis.data[i][vis.x] - meanX, 2);
        stanY+= Math.pow(vis.data[i][vis.y] - meanY, 2);
        coVar += (vis.data[i][vis.x] - meanX)* (vis.data[i][vis.y] - meanY)
    }
    stanX= Math.sqrt(stanX/vis.data.length)
    stanY= Math.sqrt(stanY/vis.data.length)
    coVar /= (vis.data.length-1)
    let corrCoeff = coVar/(stanX*stanY)
    vis.stanX = stanX
    vis.stanY = stanY
    vis.coVar = coVar
    vis.corrCoeff = corrCoeff

    vis.xScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function(d) { return d[vis.x]-.01; }), d3.max(vis.data, function(d) { return d[vis.x]+.01; })]) // input
        .range([vis.padding, vis.width]); // output


    vis.yScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function(d) { return d[vis.y]; }), d3.max(vis.data, function(d) { return d[vis.y]; })]) // input
        .range([vis.height - vis.padding / 2, vis.padding]); // output

    vis.updateVis();

}


/*
 *  The drawing function
 */

CorrelationDisplay.prototype.updateVis = function() {

    var vis = this;
    // Analyze the dataset in the web console

    //this is where I should deal with all stuff.

    //Convert numerical values to numbers

    //vis.tooltip_render(vis.happinessData);

    let padding = 20;
    svg = vis.svg

    // tip_1 = d3.tip().attr('class', 'd3-tip')
    //     .direction('se')
    //     .offset(function() {
    //         return [0, 0];
    //     }).html(function(event, d, state) {
    //         return vis.tooltip_render(d);
    //     });

    // svg.selectAll("*").remove();


    // self.svg.call(tip_1);


    svg.selectAll("circle")
        .data(vis.data) // parse through our data
        .enter()
        .append("circle") // create place holder each data item and replace with rect
        .style("fill", function(d) { return vis.colorPalette(d.Region); })
        .attr("r", 3)
        .attr("cx", function(d) {
            if (d[vis.x] != null) {
                // console.log(d.Country + " " + d.GDP + " " + vis.xScale(d.GDP))
                return vis.xScale(d[vis.x]);
            }
            return;
        }) // use xScale to find x position 
        .attr("cy", function(d) {
            if (d.Happiness_Score != null) {
                return vis.yScale(d[vis.y]);
            }
            return;
        })
        // .on('mouseover',
        //     (event, d) => tip_1.show(event, d))
        // .on('mouseout', function(event, d) {
        //     tip_1.hide();
        // }); 


    // Create an axis function specifying orientation (top, bottom, left, right)
    let xAxis = d3.axisBottom();

    // Pass in the scale function
    xAxis.scale(vis.xScale)

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (vis.height - 0.4 * vis.padding) + ")")

    .call(xAxis)

    .append('text')
        .attr("fill", "black")
        .text(vis.x)
        .attr("x", vis.width-70)
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


    // get the x and y values for least squares
		let xSeries = vis.data.map(function(d) { return +d[vis.x]; });
        let ySeries = vis.data.map(function(d) { return +d[vis.y] });
        
	    let xScale = d3.scaleLinear()
		.range([vis.padding, vis.width]);
		
	    let yScale = d3.scaleLinear()
        .range([vis.height-vis.padding, vis.padding]);
        
        let leastSquaresCoeff = leastSquares(xSeries, ySeries);


        let slope = leastSquaresCoeff[0]
        let intercept = leastSquaresCoeff[1]
        let rSquared = leastSquaresCoeff[2]
    
        //apply the reults of the least squares regression
        
        let x1 =d3.min(xSeries, function(d) { return d})
		let y1 = intercept;
		let x2 = d3.max(xSeries, function(d) { return d})
        let y2 = slope * x2+ intercept;
        let trendData = [[x1,y1,x2,y2]];

        let minY = d3.min(ySeries, function(d) { return d})
        let maxY = d3.max(ySeries, function(d){ return d})

        xScale.domain([x1, x2]);
        yScale.domain([y1, y2]);

		var trendline = svg.selectAll(".trendline")
			.data(trendData);
			
		trendline.enter()
			.append("line")
			.attr("class", "trendline")
			.attr("x1", function(d) {return vis.xScale(d[0]); })
			.attr("y1", function(d) { 
                return vis.yScale(d[1]); })
			.attr("x2", function(d) { return vis.xScale(d[2]); })
			.attr("y2", function(d) { return vis.yScale(d[3]); })
			.attr("stroke", "black")
			.attr("stroke-width", 1);
        
        // console.log(vis.parentElement)
        rSquared = Number.parseFloat(rSquared).toPrecision(4);
        slope = Number.parseFloat(slope).toPrecision(4);
        intercept = Number.parseFloat(intercept).toPrecision(4);
        let message = ""
        let strength = ""
        if(vis.corrCoeff>.7){
            message = "Strong Correlation";
            strength = "strong";
        }
        else{
            message = "Weak Correlation";
            strength = "weak"
        }
        document.getElementById("strength-"+vis.parentElement).innerHTML+= message
        document.getElementById("strength-"+vis.parentElement).classList+= strength
        document.getElementById("correlation-"+vis.parentElement).innerHTML+= Number.parseFloat(vis.corrCoeff).toPrecision(4);
        document.getElementById("r-"+vis.parentElement).innerHTML+= rSquared;
        document.getElementById("equation-"+vis.parentElement).innerHTML+= slope+"x + "+intercept;
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

