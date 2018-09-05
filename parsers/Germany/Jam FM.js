// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Copyright (c) 2018 Alexandre Storelli

var get = require("../get.js");
const { log } = require("abr-log")("meta-Germany_Jam FM");


module.exports = function(exturl, callback) {
	get(exturl, function(err, result, corsEnabled) {

		if (err) {
			return callback(err, null, null);
		}

		try {
			var parsedResult = JSON.parse(result);
		} catch(e) {
			log.debug(result);
			return callback(e.message, null, null);
		}

		parsedResult = parsedResult.filter(e => e.name === "air")[0];
		parsedResult = parsedResult.playHistories[0].track;

		const artist = parsedResult.artist;
		const title = parsedResult.title;
		const cover = parsedResult.coverUrlMedium;

		return callback(null, { artist: artist, title: title, cover: cover }, corsEnabled);
	});
}
