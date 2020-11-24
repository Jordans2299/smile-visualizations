
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

loadData();


function loadData() {
    let url = "../data/world-happiness-report-2019.csv"; 

    // TO-DO: LOAD DATA
    d3.csv(url)
        .then(function(data) {
            happinessData = data
            for(let i=0;i<data.length;i++){
                countryHappinessDict[data[i]["Country or region"]] = data[i]["Score"]
            }
            console.log("happiness data")
            console.log(happinessData)
        });

    url = "../data/freedomIndex_2018.csv"
    d3.csv(url)
    .then(function(freedomData) {
        // console.log("freedom data")
        // console.log(freedomData)
        //freedomIndexVis(freedomData)
    });
    url = "../data/suicideStats1985-2016.csv"
    d3.csv(url)
    .then(function(suicideData) {
        console.log("suicide data")
        wrangleSuicideData(suicideData)
        console.log(suicideData)
        //createVis();
    });

    // url = "../data/healthAndNutrition.csv"
    // d3.csv(url)
    // .then(function(healthData) {
    //     console.log("health")
    //     console.log(healthData)
        
    // });

    // url = "../data/mentalHealth.csv"
    // d3.csv(url)
    // .then(function(mentalHealthData) {
    //     console.log("mental health")
    //     console.log(mentalHealthData)
        
    // });


    
}

function wrangleSuicideData(data){
    var domain=["Western Europe","Central and Eastern Europe", "North America", "Latin America and Caribbean",
    "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia", 
    "Southern Asia"]



    var mySet = new Set(); 
    let newData = [];
    for(let i=0;i<data.length; i++){
        countrySuicideRateDict[data[i].country] = 0
    }
    for(let i=0;i<data.length; i++){
        countrySuicideRateDict[data[i].country] = (countrySuicideRateDict[data[i].country] + +data[i]["suicides/100k pop"])/2;
    }
    for(let i=0;i<data.length;i++){
        if(countryHappinessDict[data[i].country]!= undefined && !mySet.has(data[i].country)){
            let country = {country: data[i].country, region: countryToRegionDict[data[i].country], suicideRate: countrySuicideRateDict[data[i].country], happiness: +countryHappinessDict[data[i].country]}
            mySet.add(data[i].country)
            newData.push(country)
        }
        //mySet.add(data[i].country)
    }
    console.log("My new data")
    console.log(newData)
    suicideRateVis(newData);

}

function suicideRateVis(data) {    
    let domain=["Western Europe","Central and Eastern Europe", "North America", "Latin America and Caribbean",
    "Australia and New Zealand", "Middle East and Northern Africa", "Sub-Saharan Africa", "Southeastern Asia", "Eastern Asia", 
    "Southern Asia"]
    let range=["#dfabf5","#9d98fa","#6094e0", "#6fd6c7", "#6fd689", "#a8d66f", "#e0c975", "#eba063", "#db564f", "#db4f9e"]
    let colorScale = d3.scaleOrdinal()
    .domain(domain).range(range);


    let padding = 20;
    let width= 800;
    let height = 500;

    var svg = d3.select("#suicideGraph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var xScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(data, function(d) { return d.suicideRate; }) / 10, d3.max(data, function(d) { return d.suicideRate; }) * 12]) // input
        .range([padding / 2, width]); 


    var yScale = d3.scaleLinear() // scaleLinear is used for linear data
        .domain([d3.min(data, function(d) { return d.happiness; }) - 3, d3.max(data, function(d) { return d.happiness; }) + 3]) // input
        .range([height - padding / 2, padding / 2]); // output



    svg.selectAll("circle")
        .data(data) // parse through our data
        .enter()
        .append("circle") // create place holder each data item and replace with rect
        .style("fill", function(d) { return colorScale(d.region);})
        .style("stroke", "steelblue")
        .attr("cx", function(d) { return xScale(d.suicideRate) * 10; }) // use xScale to find x position 
        .attr("cy", function(d) { return yScale(d.happiness); }) // use yScale to find y position
        .attr("r", function(d) {
            return d.happiness * 2;
        });


    // Create an axis function specifying orientation (top, bottom, left, right)
    let xAxis = d3.axisBottom();

    // Pass in the scale function
    xAxis.scale(xScale)

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height - 1.5 * padding) + ")")

    .call(xAxis)

    .append('text')
        .attr("fill", "black")
        .text('Suicide Rate')
        .attr("x", 630)
        .attr("y", 0)


    let yAxis = d3.axisLeft();

    // Pass in the scale function
    yAxis.scale(yScale);

    // Draw the axis
    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + (padding) + ",0)")
        .call(yAxis)

    .append('text')
        .attr("fill", "black")
        .text('Happiness Score')
        .attr("x", 80)
        .attr("y", 48);
}