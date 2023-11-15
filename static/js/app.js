function getPlots(id) {
    // Read samples.json using fetch
    fetch("samples.json")
        .then(response => response.json())
        .then(sampledata => {
            // Extract data for plotting
            var ids = sampledata.samples[0].otu_ids;
            var sampleValues = sampledata.samples[0].sample_values.slice(0, 10).reverse();
            var labels = sampledata.samples[0].otu_labels.slice(0, 10);

            // Plot the bar chart
            var OTU_top = ids.slice(0, 10).reverse();
            var OTU_id = OTU_top.map(d => "OTU " + d);

            var trace = {
                x: sampleValues,
                y: OTU_id,
                text: labels,
                marker: {
                    color: 'blue'
                },
                type: "bar",
                orientation: "h",
            };

            var data = [trace];

            var layout = {
                title: "Top 10 OTU",
                yaxis: {
                    tickmode: "linear",
                },
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 30
                }
            };

            Plotly.newPlot("bar", data, layout);

            // Plot the bubble chart
            var trace1 = {
                x: ids,
                y: sampledata.samples[0].sample_values,
                mode: "markers",
                marker: {
                    size: sampledata.samples[0].sample_values,
                    color: ids
                },
                text: sampledata.samples[0].otu_labels
            };

            var layout_2 = {
                xaxis: {
                    title: "OTU ID"
                },
                height: 600,
                width: 1000
            };

            var data1 = [trace1];

            Plotly.newPlot("bubble", data1, layout_2);
        })
        .catch(error => console.error("Error fetching samples.json:", error));
}

function getDemoInfo(id) {
    fetch("samples.json")
        .then(response => response.json())
        .then(data => {
            var metadata = data.metadata;
            var result = metadata.filter(meta => meta.id.toString() === id)[0];
            var demographicInfo = d3.select("#sample-metadata");

            demographicInfo.html("");

            Object.entries(result).forEach((key) => {
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
            });
        })
        .catch(error => console.error("Error fetching samples.json:", error));
}

function init() {
    fetch("samples.json")
        .then(response => response.json())
        .then(data => {
            var dropdown = d3.select("#selDataset");

            data.names.forEach(function (name) {
                dropdown.append("option").text(name).property("value", name);
            });

            // Call the functions to display the data and the plots to the page
            getPlots(data.names[0]);
            getDemoInfo(data.names[0]);
        })
        .catch(error => console.error("Error fetching samples.json:", error));
}

// The optionChanged function should take the selected value from the dropdown
function optionChanged(selectedId) {
    getPlots(selectedId);
    getDemoInfo(selectedId);
}

init();