var request = require('request');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

function indexBy(arr, prop) {
	return arr.reduce(function (prev, item) {
		if (!(item[prop]in prev))
			prev[item[prop]] = [];
		prev[item[prop]].push(item);
		return prev;
	}, {});

}

var exemplars = require("./exemplars.json");
var ppns = indexBy(exemplars, "ppn");
var ppnsList = [];
for (ppn in ppns) {
	ppnsList.push(ppn);
}
var ppnIndex = 0;
var hasMorePPNs = function () {
	return ppnIndex < ppnsList.length;
}
var withNextPPN = function (callback) {
	var thisPPN = ppnsList[ppnIndex++];
	setTimeout(function () {
		callback(thisPPN)
	}, 1);
}

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/dataintegration';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		//HURRAY!! We are connected. :)
		console.log('Connection established to', url);

		// do some work here with the database.

		// Get the documents collection
		var collection = db.collection('swb');

		var count = 0;
		var processPPN = function processPPN(ppn) {
			collection.findOne({
				"_id" : ppn
			}, function (err, res) {

				if (!res) {
               console.log("Data for PPN not yet available: " + ppn)
                  
                  if (hasMorePPNs()) {
										withNextPPN(processPPN);
									} else {
                              console.log("No more PPNS.")
                           }
            } else {
               var xml = res.xml;
               var doc = new dom().parseFromString(xml);
               var title = xpath.select('//datafield[@tag="245"]/subfield[@code="a"]/text()', doc).toString();
					console.log("PPN: " + ppn + " / Title: " + title)
               if (hasMorePPNs()) {
						withNextPPN(processPPN);
					} else {
                  console.log("No more PPNS.")
               }

				}

			});
		}

		if (hasMorePPNs()) {
			withNextPPN(processPPN);

		}
	}
});
