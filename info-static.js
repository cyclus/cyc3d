var w = screen.width * 0.3,
h = screen.width * 0.3,
r = 380,
x = d3.scale.linear().range([0, r]),
y = d3.scale.linear().range([0, r]),
p = 15,
node,
root,
fc1,fc2,fc3;

if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
}

var colorMap = {"Wet Storage": "#1f77b4",
                "Dry Storage": "#aec7e8", 
                "Repository": "#ffbb78",
                "Reprocessed Fuel": "#2ca02c"
               }

function colorPicker(s) {
    var c = "white";
    for (var key in colorMap) {
        if (s.startsWith(key)) {
            c = colorMap[key];
            break;
        };
    };
    return c;
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
        lines = text.text().split(/\n/).reverse(),
        line,
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x)
            .attr("y", y).attr("dy", dy + "em");
        lineNumber = - Math.floor(lines.length / 2);
        while (line = lines.pop()) {
            tspan = text.append("tspan").attr("x", x)
                .attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em")
                .text(line);
        }
    });
}

var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size;})
    .padding(p);


function load_data(chart_node,json_data)
{
d3.json(json_data, function(data) {
    node = root = data;
    var nodes = pack.nodes(root);
    chart_node.selectAll("circle")
        .remove();
    chart_node.selectAll("circle")
        .data(nodes)
        .enter().append("svg:circle")
        .attr("class", function(d) { return d.children ? "parent" : "child"; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d){return colorPicker(d.name)});
    
    chart_node.selectAll("text")
        .remove();
    chart_node.selectAll("text")
        .data(nodes)
        .enter().append("svg:text")
        .attr("class", function(d) { return d.children ? "parent" : "child"; })
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
        .text(function(d) { return d.name; })
        .call(wrap);
});
}

function add_info(chart_id)
{


    var new_chart = d3.select(chart_id + " svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

    return new_chart;
}

function info()
{
    fc1 = add_info("#chart1");
    fc2 = add_info("#chart2");
    fc3 = add_info("#chart3");
}

function getTypeOrg() {

    var parser = document.createElement("a");
    parser.href = document.URL;
    searchList = parser.search.substring(1).split("&");

    var dynamic =false;

    for (var i=0;i<searchList.length;i++)
    {
        if (searchList[i] == "dynamic")
        {
            dynamic = true;
        }
        
    }

    for (var i=0;i<searchList.length;i++)
    {
        var divList = document.querySelectorAll("#" + searchList[i]);
        for (var j=0;j<divList.length;j++)
        {
            divList[j].style.display="block";
        }
        if (searchList[i] == "cost" || searchList[i] == "waste")
        {
            info();

            if (dynamic)
                {
                    load_fcs(2000,searchList[i]);
                }
            else
            {
                load_data(fc1,"info-raw-data-run1-2000_2050_2100-"+searchList[i]+".json");
                load_data(fc2,"info-raw-data-run3-2000_2050_2100-"+searchList[i]+".json");
                load_data(fc3,"info-raw-data-run5-2000_2050_2100-"+searchList[i]+".json");
            }
        }

    }
    

}

function load_fcs(year,fcs_type) {
  load_data(fc1,"years/info-raw-data-run1-" + year + "-"+fcs_type+".json");
  load_data(fc2,"years/info-raw-data-run3-" + year + "-"+fcs_type+".json");
  load_data(fc3,"years/info-raw-data-run5-" + year + "-"+fcs_type+".json");
}

function yearUpdate(year) {
  document.querySelector('#yearlabel').value = year;
  load_fcs(year);
}
