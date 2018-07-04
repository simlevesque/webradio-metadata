// Copyright (c) 2018 Alexandre Storelli
// This file is licensed under the Affero General Public License version 3 or later.
// See the LICENSE file.

var get = require("../get.js");

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
		r = r.slice(0, i1).trim(); //.slice(0, -1); // -1 to remove the last semicolon

		try {
			parsedResult = JSON.parse(r);
		} catch(e) {
			console.log(r);
			return callback(e.message, null, null);
		}

		parsedResult = parsedResult["listenApi"]["data"];

		if (parsedResult["stationNowPlaying"] && parsedResult["stationNowPlaying"]["nowPlayingTrack"]) {
			var artist = parsedResult["stationNowPlaying"]["nowPlayingArtist"];
			var title = parsedResult["stationNowPlaying"]["nowPlayingTrack"];
			var cover = parsedResult["stationNowPlaying"]["nowPlayingImage"];
		} else {
			var artist = "Kiss UK";
			var title = parsedResult["stationOnAir"]["episodeTitle"];
			var cover = parsedResult["stationOnAir"]["episodeImageUrl"];
		}


		return callback(null, { artist: artist, title: title, cover: cover }, corsEnabled);
	});
}