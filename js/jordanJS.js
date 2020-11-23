let happinessData = [];
loadData();


function loadData() {
    let url = "../data/world-happiness-report-2019.csv"; 

    // TO-DO: LOAD DATA
    d3.csv(url)
        .then(function(data) {
            console.log(data)
            //createVis();
        });
    url = 
    d3.csv(url)
    .then(function(data) {
        console.log(data)
        //createVis();
    });
    
}


function createVis() {    

}