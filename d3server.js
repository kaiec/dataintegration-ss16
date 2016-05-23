var express = require('express');
var app = express();

app.use(express.static('public'));


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)


  
})

var io = require('socket.io').listen(server);

var data = [{day: "Monday", temp: 4}, {day: "Tuesday", temp: 8}, {day: "Wednesday", temp: 15}, {day: "Thursday", temp: 8}, {day: "Friday", temp: 12}, {day: "Saturday", temp: 16}];


io.sockets.on('connection', function (socket) {
	// der Client ist verbunden
	socket.emit('data', data);
	// wenn ein Benutzer einen Text senden
	socket.on('change', function (d) {
      for (var i=0;i<data.length;i++) {
         if (data[i].day===d.day) {
            data[i].temp = data[i].temp-2;
         }
      }
		// so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('data', data);
	});
});