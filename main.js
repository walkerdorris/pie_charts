var m = 10,
    r = 100,
    z = d3.scale.category20c();


var pie = d3.layout.pie()
    .value(function(d) { return +d.percentage; })
    .sort(function(a, b) { return b.percentage - a.percentage; });


var arc = d3.svg.arc()
    .innerRadius(r / 3)
    .outerRadius(r);


d3.csv("planet_data.csv", function(error, planet_data) {
  if (error) throw error;


  var different_planets = d3.nest()
      .key(function(d) { return d.planets; })
      .entries(planet_data);


  var svg = d3.select("body").selectAll("div")
      .data(different_planets)
    .enter().append("div") 
      .style("display", "inline-block")
      .style("width", (r + m) * 2 + "px")
      .style("height", (r + m) * 2 + "px")
    .append("svg")
      .attr("width", (r + m) * 2)
      .attr("height", (r + m) * 2)
    .append("g")
      .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

 
  svg.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });


  var g = svg.selectAll("g")
      .data(function(d) { return pie(d.values); })
    .enter().append("g");


  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return z(d.data.element); })
    .append("title")
      .text(function(d) { return d.data.element + ": " + d.data.percentage; });


  g.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
      .text(function(d) { return d.data.element; });


  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }
});