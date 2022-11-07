
let violence_data;

document.addEventListener("DOMContentLoaded", function () {

    const countries = [
            "Afghanistan",
            "Albania",
            "Angola",
            "Armenia",
            "Azerbaijan",
            "Bangladesh",
            "Benin",
            "Bolivia",
            "Burkina Faso",
            "Burundi",
            "Cambodia",
            "Cameroon",
            "Chad",
            "Colombia",
            "Comoros",
            "Congo",
            "Congo Democratic Republic",
            "Cote d'Ivoire",
            "Dominican Republic",
            "Egypt",
            "Eritrea",
            "Eswatini",
            "Ethiopia",
            "Gabon",
            "Gambia",
            "Ghana",
            "Guatemala",
            "Guinea",
            "Guyana",
            "Haiti",
            "Honduras",
            "India",
            "Indonesia",
            "Jordan",
            "Kenya",
            "Kyrgyz Republic",
            "Lesotho",
            "Liberia",
            "Madagascar",
            "Malawi",
            "Maldives",
            "Mali",
            "Moldova",
            "Morocco",
            "Mozambique",
            "Myanmar",
            "Namibia",
            "Nepal",
            "Nicaragua",
            "Niger",
            "Nigeria",
            "Pakistan",
            "Peru",
            "Philippines",
            "Rwanda",
            "Sao Tome and Principe",
            "Senegal",
            "Sierra Leone",
            "South Africa",
            "Tajikistan",
            "Tanzania",
            "Timor-Leste",
            "Togo",
            "Turkey",
            "Turkmenistan",
            "Uganda",
            "Ukraine",
            "Yemen",
            "Zambia",
            "Zimbabwe"
        ];

        let country_selector = document.getElementById("country-selector");

        for (let i = 0; i < countries.length; i++) {
            let div = document.createElement("DIV");
            let label = document.createElement("LABEL");
            let input = document.createElement("INPUT");
            div.classList.add("form-check");
            div.classList.add("col-4");

            label.innerHTML = countries[i];
            label.setAttribute("for",countries[i]);
            label.className.add = "form-check-label";

            input.setAttribute("type", "radio");
            input.value = countries[i];
            input.id = countries[i] + "-radio";
            input.classList.add("form-check-input");
            input.setAttribute("onclick", "drawLolliPopChart()");
            input.setAttribute("name", "country")
            if (i == 0) {
                input.checked = true;
            }
            
            div.appendChild(label);
            div.appendChild(input);
            country_selector.appendChild(div)
        }

        Promise.all([d3.csv("data/violence_data.csv")])
        .then(function (values) {
            console.log(values[0])
            violence_data = values[0];
            drawLolliPopChart();
        });
});

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function drawLolliPopChart() {

    d3.select("#gigagraph_canvas").remove();
    
    const selected_question = document.getElementById("question-selector").value;
    const selected_demographic = document.getElementById("demographic-selector").value;
    console.log(selected_demographic)
    const selected_country = document.querySelectorAll('input[type="radio"]:checked')[0].value;

    let margin = { top: 30, right: 30, bottom: 100, left: 30 },
    width = 1300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    let svg = d3
        .select("#gigagraph-visualization")
        .append("svg")
        .attr("id", "gigagraph_canvas")
        .attr(
            "width", 
            width + 
            margin.left + 
            margin.right
        )
        .attr(
            "height", 
            height + 
            margin.top + 
            margin.bottom
        )
        .append("g")
        .attr(
            "transform", 
            "translate(" + margin.left + "," + margin.top + ")"
        );
    
    const filtered_data = violence_data.filter((item) => {
        //console.log(item["Demographics Question"] == selected_demographic)
        return selected_country == item.Country && item.Question == selected_question && item["Demographics Question"] == selected_demographic
    })

    const females_data = filtered_data.filter(data => {
        return data.Gender == 'F'
    });
    const males_data = filtered_data.filter(data => {
        return data.Gender == 'M'
    });
    const xLables = females_data.map(data => {
        return data["Demographics Response"];
    });

    const colorScale = d3.scaleOrdinal(d3.schemeSet2);

    let xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(xLables.map(function (d) { 
            return d
        }))
        .padding(1);

    let yScale = d3
        .scaleLinear()
        .domain([
            0, 100
        ])
        .range([height, 0]);
    
    svg
        .append("g")
        .attr(
            "transform", 
            "translate(0," + height + ")"
        )
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr(
            "transform", 
            "translate(12,0)"
        )
        .style(
            "text-anchor", 
            "end"
        );
    svg.append("g").call(d3.axisLeft(yScale));

    // MALE
    svg
        .selectAll("circleMale")
        .data(males_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d["Demographics Response"]) - 10;
        })
        .attr("cy", function (d) {
            return yScale(d.Value) - 6;
        })
        .attr("r", "8")
        .style("fill", "#5DA8AD")
        .attr("stroke", "black");
    svg
        .selectAll("lineMale")
        .data(males_data)
        .enter()
        .append("line")
        .attr("x1", function (d) {
            return xScale(d["Demographics Response"]) - 10;
        })
        .attr("x2", function (d) {
            return xScale(d["Demographics Response"]) - 10;
        })
        .attr("y1", function (d) {
            return yScale(d.Value);
        })
        .attr("y2", yScale(0))
        .attr("stroke", "grey");

    // FEMALE
    svg
        .selectAll("circleFemale")
        .data(females_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d["Demographics Response"]) + 10;
        })
        .attr("cy", function (d) {
            return yScale(d.Value) - 6;
        })
        .attr("r", "8")
        .style("fill", "#ffc0cb")
        .attr("stroke", "black");
    svg
        .selectAll("lineFemale")
        .data(females_data)
        .enter()
        .append("line")
        .attr("x1", function (d) {
            return xScale(d["Demographics Response"]) + 10;
        })
        .attr("x2", function (d) {
            return xScale(d["Demographics Response"]) + 10;
        })
        .attr("y1", function (d) {
            return yScale(d.Value);
        })
        .attr("y2", yScale(0))
        .attr("stroke", "grey");
}