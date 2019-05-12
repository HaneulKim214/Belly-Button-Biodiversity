function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`

  var panel = d3.select("#sample-metadata") // giving reference, not panel is div tag
  d3.json(url).then(function(data){
    panel.html("") // clearing anything inside div tag.
    var entries = Object.entries(data);
    // note entries is array in an array. [0] = key, [1] = value
    entries.forEach(entry => {
      panel.append('p').text(`${entry[0]} : ${entry[1]}`)
    });
  });
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function piechart(alldata){
  var values = alldata.sample_values.slice(0,10);
  var labels = alldata.otu_ids.slice(0,10);
  var hover_text = alldata.otu_labels.slice(0,10);
  var trace = {
    "values":values,
    "labels":labels,
    "hovertext":hover_text,
    "type":"pie"
  };
  var data = [trace];
  var loc_plot = document.getElementById("pie");
  Plotly.newPlot(loc_plot, data);
};

function bubblechart(data){
  var x = data.out_ids;
  var y = data.sample_values;
  var markersize = data.sample_values;
  var markercolors = data.otu_ids;
  var textvalues = data.otu_labels;
  console.log(markercolors);
  var trace = {
    "x": x,
    "y":y,
    text:textvalues,
    mode: "markers",
    marker:{
      size:markersize,
      color:markercolors
    }
  };
  var layout = {
    title:"Bubble Chart",
    xaxis: {title:"OTU ID"},
    showlegend:true
  };
  var data = [trace];
  var plot_loc = document.getElementById("bubble");
  Plotly.newPlot(plot_loc, data, layout);
};


function buildCharts(sample) {
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data){
    // send data retrived from my url to two plotting functions
    piechart(data);
    bubblechart(data);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0]; // 940
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
