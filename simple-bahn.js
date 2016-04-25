(function() {
    var request = require('request');
    var http = require('http');
    var cheerio = require('cheerio');
    require("array.prototype.find");    
    require("array.prototype.findindex");
    
    
    

   var levels = ["info", "error", "warning"];
   var delay = 10000;

    var log = function(level, message) {
	if (levels.indexOf(level)>-1) {
	    console.log(level.toUpperCase() + ": " + message);
	} 
    }

    
    var die = function(msg) { throw msg; };
    

    var Products = {
	// ICE, IC/EC, Interregio und Schnellzug, Regio- und Nahverkehr, 
	// S-Bahn, Bus, Schiff, U-Bahn, Straßenbahn, Anruf-Sammeltaxi
	index: ["ICE", "IC", "IR", "NV", "S", "Bus", "Schiff", "U", "StrB", "Taxi"],
	get: function(products) {
	    var res = "";
	    this.index.forEach(function(el) {
		res += !products||products.indexOf(el)>-1?"1":"0";
	    });
	    return res;
	}
    }

    
    var toTime = function(date) {
	var t = date.toLocaleTimeString('de-DE', {timezone: "CET", hour: "2-digit", minute: "2-digit"});
	var res = t.split(":");
	return res[0] + ":" + res[1];			 
    };

    var toDateString = function(date) {
	// Not working in node.js, see https://github.com/nodejs/node/issues/4159
	// var res = date.toLocaleDateString('de-DE', { year: 'numeric', month: 'numeric', day: 'numeric' });
	var res = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
	return res;
    };


    var _find = function(array, selector) {
	var res = {};
	res.index = array.findIndex(selector);
	if (res.index===-1) return null;
	res.value = array[res.index];
	return res;
    }



    function getConnections(callback) {
	var from = "Stuttgart Hbf" ;
	var to = "Stuttgart Universität";
	var time = time || toTime(new Date());
	var date = date || toDateString(new Date());
	log("info", "fetching " +  time + " (" + date + ")");
	var headers =  {
	    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0",
	    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
	    "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
	    "Accept-Encoding": "gzip, deflate",
	};
	var options = {
	    url: "http://mobile.bahn.de/bin/mobil/query.exe/dox",
	    qs: {
		S: from,
		Z: to,
		rt: 1,
		time: time,
		date: date,
		use_realtime_filter: 1,
		sotRequest: 1,
		start: 1,
		REQ0JourneyProduct_prod_list_0:Products.get(["S"]),
		REQ0JourneyProduct_opt0: 1,
		REQ0HafasSearchForw: 0
	    },
	    headers: headers
	};
	
	
	
	
	
	request.get(
	    options,
	    function (error, response, body) {
		if (error) {
		    callback(error);
		} else {
		    var $ = cheerio.load(body);
		    var called = 0;
		    var connections = [];
		    if (!$("table.ovTable>tr:has(td.timelink)").length) {
			console.log("ERROR: No connections found.");
			callback(null, []);
			return;
		    }
		    $("table.ovTable>tr:has(td.timelink)").each(function(index, tr) {
			var res = {}
			res.from = from,
			res.to = to,
			res.start = $(tr).find("td.timelink a span").first().text();
			res.end = $(tr).find("td.timelink a span").last().text();
			res.date = date;
			res.delayStart = $(tr).find("td.tprt span").first().text();
			res.delayEnd = $(tr).find("td.tprt span").last().text();
			res.type = $(tr).find("td.iphonepfeil").text();
			connections.push(res);
		    });
		    callback(null, connections);
		}
	    });
    }
    
	

    
	getConnections(function(error,connections) {
	    if (error) {console.log("Error");}
	    else {
		console.log(JSON.stringify(connections));
	    }
	});

}).call(this);
