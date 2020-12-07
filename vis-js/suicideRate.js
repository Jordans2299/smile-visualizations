
SuicideRateChart = function (_parentElement, _happinessData, _auxiliaryData) {
    this.parentElement = _parentElement;
    this.happinessData = _happinessData;
    this.auxiliaryData = _auxiliaryData;
    this.width = 700;
    this.height = 500;
    this.initVis();
}

SuicideRateChart.prototype.initVis = function () {
    var vis = this;
    var domain = ["Western Europe", "Central and Eastern Europe", "North America", "Latin America and Caribbean",
        "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia",
        "Southern Asia"]
    var range = ["#dfabf5", "#9d98fa", "#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
    vis.colorPalette = vis.colorScale = d3.scaleOrdinal()
        .domain(domain).range(range);

    vis.svg = d3.select("#" + vis.parentElement)
    vis.padding = 20;
    vis.wrangleData();
}

SuicideRateChart.prototype.wrangleData = function () {
    let countryToRegionDict = { "Albania": "Central and Eastern Europe",
    "Antigua and Barbuda": "Latin America and Caribbean",
    "Argentina": "Latin America and Caribbean",
    "Armenia": "Central and Eastern Europe",
    "Aruba":"Latin America and Caribbean",
    "Australia": "Australia and New Zealand",
    "Austria":"Central and Eastern Europe",
    "Azerbaijan": "Central and Eastern Europe",
    "Bahamas": "Latin America and Caribbean",
    "Bahrain": "Middle East and Northern Africa",
    "Barbados":"Latin America and Caribbean",
    "Belarus": "Central and Eastern Europe",
    "Belgium": "Central and Eastern Europe",
    "Belize": "Latin America and Caribbean",
    "Bosnia and Herzegovina": "Central and Eastern Europe",
    "Brazil": "Latin America and Caribbean",
    "Bulgaria": "Central and Eastern Europe",
    "Cabo Verde": "Latin America and Caribbean",
    "Canada": "North America",
    "Chile": "Latin America and Caribbean",
    "Colombia": "Latin America and Caribbean",
    "Costa Rica": "Latin America and Caribbean",
    "Croatia": "Central and Eastern Europe",
    "Cuba": "Latin America and Caribbean",
    "Cyprus": "Middle East and Northern Africa",
    "Czech Republic": "Central and Eastern Europe",
    "Denmark": "Western Europe",
    "Dominica": "Latin America and Caribbean",
    "Ecuador": "Latin America and Caribbean",
    "El Salvador": "Latin America and Caribbean",
    "Estonia": "Central and Eastern Europe",
    "Fiji": "Latin America and Caribbean",
    "Finland": "Central and Eastern Europe",
    "France": "Western Europe",
    "Georgia": "Central and Eastern Europe",
    "Germany": "Western Europe",
    "Greece": "Central and Eastern Europe",
    "Grenada": "Latin America and Caribbean",
    "Guatemala": "Latin America and Caribbean",
    "Guyana": "Latin America and Caribbean",
    "Hungary": "Central and Eastern Europe",
    "Iceland": "Western Europe",
    "Ireland": "Western Europe",
    "Israel": "Middle East and Northern Africa",
    "Italy": "Western Europe",
    "Jamaica": "Latin America and Caribbean",
    "Japan": "Eastern Asia",
    "Kazakhstan": "Middle East and Northern Africa",
    "Kiribati": "Middle East and Northern Africa",
    "Kuwait": "Middle East and Northern Africa",
    "Kyrgyzstan": "Middle East and Northern Africa",
    "Latvia": "Central and Eastern Europe",
    "Lithuania": "Central and Eastern Europe",
    "Luxembourg": "Western Europe",
    "Macau": "Southeastern Asia",
    "Maldives": "Southern Asia",
    "Malta": "Western Europe",
    "Mauritius": "Middle East and Northern Africa",
    "Mexico": "Latin America and Caribbean",
    "Mongolia": "Eastern Asia",
    "Montenegro": "Central and Eastern Europe",
    "Netherlands": "Western Europe",
    "New Zealand": "Australia and New Zealand",
    "Nicaragua": "Latin America and Caribbean",
    "Norway": "Western Europe",
    "Oman": "Middle East and Northern Africa",
    "Panama": "Latin America and Caribbean",
    "Paraguay": "Latin America and Caribbean",
    "Philippines": "Southeastern Asia",
    "Poland": "Central and Eastern Europe",
    "Portugal": "Western Europe",
    "Puerto Rico": "Latin America and Caribbean",
    "Qatar": "Middle East and Northern Africa",
    "Republic of Korea": "Eastern Asia",
    "Romania": "Central and Eastern Europe",
    "Russian Federation": "Central and Eastern Europe",
    "Saint Kitts and Nevis": "Latin America and Caribbean",
    "Saint Lucia": "Latin America and Caribbean",
    "Saint Vincent and Grenadines": "Latin America and Caribbean",
    "San Marino": "Latin America and Caribbean",
    "Serbia": "Central and Eastern Europe",
    "Seychelles": "Middle East and Northern Africa",
    "Singapore": "Eastern Asia",
    "Slovakia": "Central and Eastern Europe",
    "Slovenia": "Central and Eastern Europe",
    "South Africa": "Sub-Saharan Africa",
    "Spain": "Western Europe",
    "Sri Lanka": "Middle East and Northern Africa",
    "Suriname": "Latin America and Caribbean",
    "Sweden": "Western Europe",
    "Switzerland": "Western Europe",
    "Thailand": "Southeastern Asia",
    "Trinidad and Tobago": "Latin America and Caribbean",
    "Turkey": "Central and Eastern Europe",
    "Turkmenistan": "Middle East and Northern Africa",
    "Ukraine": "Central and Eastern Europe",
    "United Arab Emirates": "Middle East and Northern Africa",
    "United Kingdom": "Western Europe",
    "United States": "North America",
    "Uruguay": "Latin America and Caribbean",
    "Uzbekistan": "Middle East and Northern Africa"}

    let countryHappinessDict = {}

    let countrySuicideRateDict = {}

    let happinessData = [];
    var vis = this;
    for(let i=0;i<vis.happinessData.length;i++){
        let data = vis.happinessData;
        countryHappinessDict[data[i]["Country"]] = data[i]["Happiness_Score"]
    }

    let data = vis.auxiliaryData
    var mySet = new Set(); 
    let newData = [];
    for(let i=0;i<data.length; i++){
        countrySuicideRateDict[data[i].country] = 0
    }
    for(let i=0;i<data.length; i++){
        countrySuicideRateDict[data[i].country] = (countrySuicideRateDict[data[i].country] + +data[i]["suicides/100k pop"])/2;
    }
    for(let i=0;i<data.length;i++){
        if(countryHappinessDict[data[i].country]!= undefined && !mySet.has(data[i].country) && countrySuicideRateDict[data[i].country]>0){
            let country = {country: data[i].country, region: countryToRegionDict[data[i].country], suicideRate: countrySuicideRateDict[data[i].country], happiness: +countryHappinessDict[data[i].country]}
            mySet.add(data[i].country)
            newData.push(country)
        }
    }
    vis.data = newData
    vis.xScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function (d) { return d.suicideRate-1; }), d3.max(vis.data, function (d) { return d.suicideRate; }) + 5]) // input
        .range([vis.padding / 2, vis.width]); // output


    vis.yScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(vis.data, function (d) { return d.happiness; }) - 3, d3.max(vis.data, function (d) { return d.happiness; }) + 3]) // input
        .range([vis.height - vis.padding / 2, vis.padding / 2]); // output
    // Update the visualization
    vis.updateVis();
}

SuicideRateChart.prototype.updateVis = function () {

    var vis = this;
    // Analyze the dataset in the web console

    //this is where I should deal with all stuff.

    //Convert numerical values to numbers

    let padding = 20;
    svg = vis.svg

    svg.selectAll("*").remove();

    let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    svg.selectAll("circle")
        .data(vis.data) // parse through our data
        .enter()
        .append("circle") // create place holder each data item and replace with rect
        .style("fill", function (d) { return vis.colorPalette(d.region); })
        .attr("r",10)
        .attr("cx", function(d) { return vis.xScale(d.suicideRate); }) 
        .attr("cy", function(d) { return vis.yScale(d.happiness); })



    // Create an axis function specifying orientation (top, bottom, left, right)
    let xAxis = d3.axisBottom();

    // Pass in the scale function
    xAxis.scale(vis.xScale)

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (vis.height - 1.5 * vis.padding) + ")")

        .call(xAxis)

        .append('text')
        .attr("fill", "black")
        .text('Suicide Rate')
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
}