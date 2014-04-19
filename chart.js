function chart(dynamic,kind)
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
    
    var yLabel = 'Mass of Waste (Tonnes)';
    var yMax = 500000;
    var json_data1 = 'raw-data-run5-waste.json';
    var json_data2 = 'raw-data-run3-waste.json';
    var json_data3 = 'raw-data-run1-waste.json';

    function add_chart(chart_id,json_data)
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
                    .showLegend(false)
                    .forceX([946713600000, 4102473600000])
                    .color(["#1f77b4", "#aec7e8", "#ffbb78", "#2ca02c"])
                    .clipEdge(true);

                //Format x-axis labels with custom function.
                chart.xAxis
                    .tickValues([946713600000, 1738809360000, 2527749360000, 3316689360000, 4102473600000])
                    .tickFormat(function(d) {return d3.time.format('%Y')(new Date(d))})
                    .axisLabel('Year');

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

    if (kind == "cost")
    {
        yLabel = 'Cost in Millions of USD';
        yMax = 30000;
        var json_data1 = 'raw-data-run1-new-cost.json';
        var json_data2 = 'raw-data-run3-new-cost.json';
        var json_data3 = 'raw-data-run5-new-cost.json';
    }

    if (dynamic == true)
    {
        willHaveGuidelines = true;
        //willBeInteractive = true;
        //willUseVoronoi = true;
    }

    add_chart('#chart1',json_data1);
    add_chart('#chart2',json_data2);
    add_chart('#chart3',json_data3);

}
