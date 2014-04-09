function chart_static(yLabel,yMax,json_data1,json_data2,json_data3)
{
    var chartAttrs = {
        "width": '100%',
        "height": '80%'
    };
    
    var chartMargins = {
        right: 75
    };
    
    var willShowControls = false;
    var willHaveGuidelines = false;
    
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
                    .interactive(false)
                    .useVoronoi(false)
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

chart_static('Cost in USD',
             140000,
             'raw-data-run1-cost.json',
             'raw-data-run3-cost.json',
             'raw-data-run5-cost.json');