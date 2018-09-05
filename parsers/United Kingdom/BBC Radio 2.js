// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// Copyright (c) 2018 Alexandre Storelli

var get = require("../get.js");
const { log } = require("abr-log")("meta-United Kingdom_BBC Radio 2");

module.exports = function(exturl, callback) {
	get(exturl, function(err, result, corsEnabled) {
		if (err) {
			return callback(err, null, null);
		}

		const b0 = "window.__PRELOADED_STATE__ = ";
		const i0 = result.indexOf(b0);
		let r = result.slice(i0+b0.length);

		const b1 = "</script>";
		const i1 = r.indexOf(b1);
		r = r.slice(0, i1).trim().slice(0, -1); // -1 to remove the last semicolon

		try {
			parsedResult = JSON.parse(r);
		} catch(e) {
			log.debug(r);
			return callback(e.message, null, null);
		}

		parsedResult = parsedResult["modules"];
		parsedResult = parsedResult.filter(e => e.id === "listen_live")[0]["items"];
		parsedResult = parsedResult.filter(e => e.id === "bbc_radio_two")[0];
		//log.debug(JSON.stringify(parsedResult, null, "\t"));

		const artist = parsedResult["titles"]["primary"];
		const title = parsedResult["titles"]["secondary"];
		const cover = parsedResult["image_url"].replace("{recipe}", "304x304");

		return callback(null, { artist: artist, title: title, cover: cover }, corsEnabled);
	});
}
