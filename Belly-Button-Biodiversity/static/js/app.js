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

function gaugeChart(data) {
  // Enter a speed between 0 and 180
  var degree = parseInt(data.WFREQ) * (180/10);

  var level = degree;

  // Trig to calc meter point
  var degrees = 180 - level,
       radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var trace = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'WASH FREQ',
      text: data.WFREQ,
      hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size : 16,
      },
    marker: {colors:['rgba(6, 51, 0, .5)', 'rgba(9, 77, 0, .5)', 
                           'rgba(12, 102, 0 ,.5)', 'rgba(14, 127, 0, .5)',
                           'rgba(110, 154, 22, .5)','rgba(170, 202, 42, .5)', 
                           'rgba(202, 209, 95, .5)','rgba(210, 206, 145, .5)', 
                           'rgba(232, 226, 202, .5)','rgba(255, 255, 255, 0)'
                    ]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];
  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],

    title: '<b> Belly Button Washing Frequency</b> <br> Scrub Per Week',
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});
}


function buildCharts(sample) {
  d3.json(`/wfreq/${sample}`).then ( wdata =>
    // ## Gauge Chart ##
    gaugeChart(wdata)
  );
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


