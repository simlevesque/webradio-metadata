let urls = require("./urls.js");

var getStreamMetadata = function(country, name, callback) {
	for (let i=0; i<urls.length; i++) {				// loop on countries
		if (urls[i].country === country) {
			for (let j=0; j<urls[i].radios.length; j++) {	// loop on radios
				if (urls[i].radios[j].name === name) {
					if (!urls[i].radios[j].parser) urls[i].radios[j].parser = country + "_" + name;
					return require("./parsers/" + urls[i].radios[j].parser + ".js")(urls[i].radios[j].url, function(error, parsedData, corsEnabled) {
						if (error) {
							return callback(error, null, corsEnabled);
						} else {
							return callback(null, parsedData, corsEnabled);
						}
					});
				}
			}
		}
	}
	return callback("radio not found", null);
}

module.exports = getStreamMetadata;

if (process.argv.length >= 3 && process.argv[1].slice(-20) == "getStreamMetadata.js") { // standalone usage
	if (process.argv[2] == "list") {				// loop on countries
		console.log("list of available parsing recipes:");
		for (let i=0; i<urls.length; i++) {
			for (let j=0; j<urls[i].radios.length; j++) {	// loop on radios
				console.log(urls[i].country + " - " + urls[i].radios[j].name);
			}
		}
		return
	} else if (process.argv[2] == "all" || process.argv[2] == "test") {
		var testMode = process.argv[2] == "test";
		var jobs = [];
		for (let i=0; i<urls.length; i++) {
			for (let j=0; j<urls[i].radios.length; j++) {	// loop on radios
				jobs.push({ country: urls[i].country, name: urls[i].radios[j].name });
			}
		}

		var f = function(ijob, callback) {
			if (ijob >= jobs.length) return callback();
			getStreamMetadata(jobs[ijob].country, jobs[ijob].name, function(err, data, corsEnabled) {
				Object.assign(jobs[ijob], {
					err: err,
					data: data,
					corsEnabled: corsEnabled
				});
				if (testMode && err) console.log(jobs[ijob].country + "_" + jobs[ijob].name + " : error=" + err);
				f(ijob+1, callback);
			});
		}
		f(0, function() {
			if (!testMode) console.log(JSON.stringify(jobs));
		})
	} else if (process.argv.length >= 4) {
		getStreamMetadata(process.argv[2], process.argv[3], function(err, data, corsEnabled) {
			console.log(JSON.stringify({ err: err, data: data, corsEnabled: corsEnabled }));
		});
	}

}
