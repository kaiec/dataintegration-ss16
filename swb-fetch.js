var request = require('request');

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
					count++;
					var swburl = "http://swb.bsz-bw.de/sru/DB=2.1/username=/password=/?query=pica.ppn+%3D+%22" + ppn + "%22&version=1.1&operation=searchRetrieve&stylesheet=http%3A%2F%2Fswb.bsz-bw.de%2Fsru%2F%3Fxsl%3DsearchRetrieveResponse&recordSchema=marc21&maximumRecords=1&startRecord=1&recordPacking=xml&sortKeys=none&x-info-5-mg-requestGroupings=none";
					request(swburl, function (error, response, body) {
						if (!error && response.statusCode == 200) {
							var title1 = {
								"_id" : ppn,
								"xml" : body
							};
							console.log(count + " / " + ppn + ": " + ppns[ppn].length);
							collection.insert(title1, function (err, result) {
								if (err) {
									console.log(err);
								} else {
									console.log('Inserted ' + ppn);
									if (hasMorePPNs()) {
										withNextPPN(processPPN);
									} else {
                              console.log("No more PPNS.")
                           }

								}
							});
						} else {
                     console.log("Error: " + JSON.stringify(error) + " / Response: " + JSON.stringify(response));
                  }
					})
				} else {
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

		/*
		// Insert some users
		collection.insert([title1], function (err, result) {
		if (err) {
		console.log(err);
		} else {
		console.log('Inserted %d documents into the "catalog" collection. The documents inserted with "_id" are:', result.length, result);
		}

		//Close connection
		db.close();
		});
		 */
	}
});
