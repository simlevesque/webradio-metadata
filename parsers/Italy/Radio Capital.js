// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Copyright (c) 2018 Alexandre Storelli

var get = require("../get.js");
const { log } = require("abr-log")("meta-Italy_Radio Capital");


module.exports = function(exturl, callback) {
	get(exturl, function(err, result, corsEnabled) {
		if (err) {
			return callback(err, null, null);
		}

		try {
			parsedResult = JSON.parse(result)["result"];
		} catch(e) {
			log.debug(result);
			return callback(e.message, null, null);
		}

		//log.debug(JSON.stringify(parsedResult, null, "\t"));
		const artist = parsedResult.artist;
		const title = parsedResult.title;
		const cover = parsedResult.coverUrl;

		return callback(null, { artist: artist, title: title, cover: cover }, corsEnabled);
	});
}
