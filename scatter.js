
d3.csv('wealth-health-2014.csv',d=>{
    return {
        ...d,
        LifeExpectancy: +d.LifeExpectancy,
        Income: +d.Income,
        Population: +d.Population,

    }
        }).then(data => {
            console.log('wealth-health-2014.csv',data);
        })
           

d3.csv('wealth-health-2014.csv',d3.autoType).then(data => {
    console.log('wealth-health-2014.csv',data);
    const margin = ({top:20,right:20,bottom:20,left:20});
    const width = 700- margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) { return d.Income}))
        .range([0,width]);
    console.log(d3.extent(data, function (d) { return d.Income}))
    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) { return d.LifeExpectancy}))
        .range([height,0]);

    const colorScale = d3
        .scaleOrdinal(d3.schemeTableau10)
        .domain(d3.extent(data, function (d) { return d.Region}))
        ;
    
    const popScale = d3
        .scaleSqrt()
        .domain(d3.extent(data,function(d){ return d.Population}))
        .range([5,30])
        ;
        
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, "s")
    
    const yAxis = d3.axisLeft()
        .scale(yScale)


    var svg = d3.select('.chart')
        .append('svg')
        .attr('width',width+ margin.left + margin.right)
        .attr('height',height+ margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;

    svg.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        ;
    svg.append('g')
        .call(yAxis)

    svg.append("text")
		.attr('x', 600)
		.attr('y', 550)
		// add attrs such as alignment-baseline and text-anchor as necessary
        .text("Income")

    svg.append("text")
		.attr('x', -20)
		.attr('y', -5)
		// add attrs such as alignment-baseline and text-anchor as necessary
        .text("Life Expectancy")
        .attr("transform", "rotate(90)")

        
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx',d=>xScale(d.Income))
        .attr('cy',d=>yScale(d.LifeExpectancy))
        .attr('r',d=>popScale(d.Population))
        .attr('fill',d=>colorScale(d['Region']))
        .attr('opacity',0.7)
        .attr('stroke','black')
        .attr('stroke-width',.6)
        .on("mouseenter", (event, d) => {
            var country = d['Country'];
            var region = d.Region;
            var pop = d3.format(",.2r")(d.Population);
            var income = d3.format(",.2r")(d.Income);
            var life = d3.format(".0f")(d.LifeExpectancy);
            const pos = d3.pointer(event,window);

            var tooltip1 = d3.select('.tooltip')
                .attr("class", "tooltip")
                .style('display','block')
                .style('background-color','black')
                .style('color','white')
                .style('opacity',.8)
                .style('padding','10px')
                .style("top",pos[1]-150+'px')
                .style("left",pos[0]+'px')
                .html("Country: "+country+'<br>'+
            'Region: '+region+ '<br>'+
            'Population: '+pop + '<br>'+
            'Income: '+income + '<br>'+
            'Life Expectancy: '+life
                );
     
        }
            
        )
        .on("mouseleave", (event, d) => {
            // hide the tooltip
            d3.select('.tooltip')
                .style('display','none')
        });

        var legend = svg.selectAll(".legend")
                .data(colorScale.domain())
                .enter()
                .append("g")
                .attr("transform", function(d, i) { return "translate(" + "-200," + i * 20 + ")"; });
            
        
        legend.append("rect")
                .attr("x", width + 10)
                .attr('y',height-200)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", colorScale);
        
        legend.append("text")
                 .attr("x", width + 26)
                 .attr('y',height-200)
                 .attr("dy", ".65em")
                 .text(function(d) {
                        return d;
                    });
         


})