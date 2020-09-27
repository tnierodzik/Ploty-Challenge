// Test Console
console.log("hello")

// Create function for Meta Data table
function buildMetaData(sample) {

    // Use d3 to read samples.json
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;

        // Filter Mircobes for drop down selection
        var fitleredmetadata = metadata.filter(mircobe => mircobe.id == sample);
        
        // Select ID 
        var results = fitleredmetadata[0];

        // Test Console Results
        console.log(results);

        // Use d3 to select mircobe
        var panel = d3.select("#sample-metadata");

        // Use html to clear existing metadata
        panel.html("");

        // Use object entries to add key and value to the panel
        Object.entries(results).forEach(([key, value]) => {
            panel.append("h6").text(`${key}:${value}`);
        });   

    });
};

// Create function for BarChart
function buildBarChart (sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var filteredsamples = samples.filter(mircobe => mircobe.id == sample);
        var results = filteredsamples[0];

        // Use Console to test results
        console.log(results);

        // Create variable for bar chart
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        // Create Bar Layout
        var barlayout = {
            width: 1000,
            margin: {
                t:30,
                l:150
            },
        };

        // Create Bar Data
        var bardata = [{
            
            // Use Slice to get top ten results for the mircobe and reverse the hierarchy 
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(OTUID => `OTD ${OTUID}`).reverse(),
            hovertext: otu_labels,
            type: "bar",
            orientation: "h"
        }];

        // Use Plotly to create the bar chart
        Plotly.newPlot("bar",bardata, barlayout);
    });
};

// Create Function for Bubble Data 
function buildBubbleChart(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var filteredsamples = samples.filter(mircobe => mircobe.id == sample);
        var results = filteredsamples[0];

        // Use Console to test results
        console.log(results);

        // Create variables for bubble chart
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        // Create Bubble Layout
        var bubblelayout = {
            height: 800,
            width: 1200,
            xaxis: {title: "UTO-ID"},
            margin: {
                t:10,
                l:35
            },
        }

        // Create Bubble Data
        var bubbledata = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
              size: sample_values,
              color: otu_ids
            }
        }];

        // Use Ploty to create bubble chart
        Plotly.newPlot("bubble", bubbledata, bubblelayout);
    });
};

// Create function for initiation 
function init() {

    // Use d3 select to select the dropdown input
    var inputselctor =  d3.select("#selDataset")

    // Use d3 to read samples.json
    d3.json("samples.json").then((data) => {
    
    // Add list of Mircobe Ids to dropdown
    var dropmircobe = data.names;
    dropmircobe.forEach((sample) => {
        inputselctor
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first mircobe to build the plots
    var firstSample = dropmircobe[0];
    buildBubbleChart(firstSample);
    buildMetaData(firstSample);
    buildBarChart(firstSample);
    });
};

// Fetch new data each time a new mirocbe is selected
function optionChanged(newSample) {
    buildBubbleChart(newSample);
    buildMetaData(newSample);
    buildBarChart(newSample);
}

// Initialize the dashboard
init();

