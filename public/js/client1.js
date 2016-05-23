console.log("Client 1 startet.");
var data = [{day: "Monday", temp: 1}, {day: "Tuesday", temp: 1}, {day: "Wednesday", temp: 1}, {day: "Thursday", temp: 1}, {day: "Friday", temp: 1}, {day: "Saturday", temp: 1}];


var socket = io.connect();


d3.select("body")
    .style("color", "black")
    .style("background-color", "white");

d3.select("body").append("div").classed("chart", true);

var scaleX = d3.scale.linear()
    .domain([0, d3.max(data, function(d) {return d.temp})])
    .range([0, 640]);

socket.on('data', function (d) {
data = d;
scaleX.domain([0, d3.max(data, function(d) {return d.temp})]);  
d3.select(".chart")
  .selectAll("div").data(data).transition().style("width", function(d) { return scaleX(d.temp) + "px"; });    
});

    
d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return scaleX(d.temp) + "px"; })
    .text(function(d) { return d.day; });


    
d3.select(".chart")
  .selectAll("div")
  .on("mouseover", function(d) {
    socket.emit("change", d);
    d3.select(this).classed("highlight", true); })
  .on("mouseout", function() {
    d3.select(this).classed("highlight", false) });
    
