var w = Math.min(screen.height*0.60,500),
h = w,
r = h*0.9,
rmin = h * 0.2,
x = d3.scale.linear().range([0, r]),
y = d3.scale.linear().range([0, r]),
p = 15,
label_rad = 25,
node,
root,
fc1,fc2,fc3,
chart_dyn,
dynamic = false,
chart_type;

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

function scaled_pack(v) {
    var pack = d3.layout.pack()
        .size([r*v, r*v])
        .value(function(d) { return d.size;})
        .padding(p);
    return pack
}

var pack = scaled_pack(1.0);

function load_data(chart_node,json_data,scale_var)
{
    d3.json(json_data, function(data) {
        pack.size([(r-rmin)*data.scale+rmin, (r-rmin)*data.scale+rmin]);
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
            .style("stroke-width",function(d) {if (d.children && (d.children[0].children || d.children[1].children) )
                                               {return 0}; return 1;})
            .style("fill", function(d){return colorPicker(d.name)});
        
        chart_node.selectAll("text")
            .remove();
        chart_node.selectAll("text")
            .data(nodes)
            .enter().append("svg:text")
            .attr("class", function(d) { return d.children ? "parent" : "child"; })
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { if (d.children) {return d.y - d.r - 20;}; if (d.r < 21.5) {return d.y + d.r + 10;}; return d.y; })
            .attr("dy", "-.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { if (d.children) {return d.name;}; return d.name.split('\n').slice(1,3).join('\n'); })
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

function load_static(kind)
{
    var cost_ver = "";
    var vary_run = +2;

    if (kind == "cost")
    {
        cost_ver = "-new";
        vary_run = -2;
    }
    load_data(fc1,"info-raw-data-run" + (3+vary_run).toString() +  cost_ver + "-2000_2050_2100-" + kind + ".json");
    load_data(fc2,"info-raw-data-run" + (3+0).toString() +  cost_ver + "-2000_2050_2100-" + kind + ".json");
    load_data(fc3,"info-raw-data-run" + (3-vary_run).toString() +  cost_ver + "-2000_2050_2100-" + kind + ".json");
}

function load_fcs(kind,year) {
    var cost_ver = "";
    var vary_run = +2;
    
    if (kind == "cost")
    {
        cost_ver = "-new";
        var vary_run = -2;
    }
    load_data(fc1,"years/info-raw-data-run" + (3+vary_run).toString() + cost_ver + "-" + year + "-" + kind + ".json");
    load_data(fc2,"years/info-raw-data-run" + (3+0).toString()  + cost_ver + "-" + year + "-" + kind + ".json");
    load_data(fc3,"years/info-raw-data-run" + (3-vary_run).toString()  + cost_ver + "-" + year + "-" + kind + ".json");
}

function yearUpdate(year) {
    document.querySelector('#yearlabel').value = year;
    load_fcs(chart_type,year);
}

function info(dynamic,kind)
{
    chart_type = kind;
    chart_dyn = dynamic;
    
    fc1 = add_info("#chart1");
    fc2 = add_info("#chart2");
    fc3 = add_info("#chart3");

    
    if (dynamic)
    {
        load_fcs(kind,2000);
    }
    else
    {
        load_static(kind);
    }
}

