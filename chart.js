
function chart(dynamic,yLabel,yMax,json_data1,json_data2,json_data3)
{
    var chartAttrs = {
        "width": '100%',
        "height": '90%'
    };
    
    var chartMargins = {
        right: 75
    };
    
    var willShowControls = false;
    var willHaveGuidelines = false;
    var willBeInteractive = false;
    var willUseVoronoi = false;
    
    if (dynamic == true)
    {
        willHaveGuidelines = true;
        //willBeInteractive = true;
        //willUseVoronoi = true;
    }

    function add_chart(json_data,chart_id)
    {
        d3.json(json_data, function (data) {
            nv.addGraph(function() {
                var chart = nv.models.stackedAreaChart()
                    .margin(chartMargins)
                    .x(function(d) { return d[0] })   //We can modify the data accessor functions...
                    .y(function(d) { return d[1] })   //...in case your data is formatted differently.
                    .yDomain([0, yMax])
                    .useInteractiveGuideline(willHaveGuidelines)    //Tooltips which show all data points. Very nice!
                    .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                    .transitionDuration(500)
                    .showControls(willShowControls)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                    .interactive(willBeInteractive)
                    .useVoronoi(willUseVoronoi)
                    .clipEdge(true);
                
                //Format x-axis labels with custom function.
                chart.xAxis
                    .axisLabel('Year')
                    .tickFormat(function(d) { 
                        return d3.time.format('%Y')(new Date(d)) 
                    });
                
                chart.yAxis
                    .axisLabel(yLabel)
                    .tickFormat(d3.format(',.f'));
                
                d3.select(chart_id + ' svg')
                    .datum(data)
                    .attr(chartAttrs)
                    .call(chart);
                
                nv.utils.windowResize(chart.update);
                
                return chart;
            });
        });
    }
    
    add_chart(json_data1,'#chart1');
    add_chart(json_data2,'#chart2');
    add_chart(json_data3,'#chart3');

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
        if (searchList[i] == "cost")
        {
            chart(dynamic,
                  'Cost in USD',
                  140000,
                  'raw-data-run1-cost.json',
                  'raw-data-run3-cost.json',
                  'raw-data-run5-cost.json');
        }
        if (searchList[i] == "waste")
        {
            chart(dynamic,
                  'Volume of Waste (Tonnes)',
                  461332,
                  'raw-data-run1-waste.json',
                  'raw-data-run3-waste.json',
                  'raw-data-run5-waste.json');
        }

    }
    

}
