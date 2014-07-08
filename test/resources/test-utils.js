function testUtils() {
	function ab2str(buf) {
		return String.fromCharCode.apply(null, new Uint8Array(buf));
	}

	function str2ab(str) {
		var buf = new ArrayBuffer(str.length * 2),
			bufView = new Uint8Array(buf);

		for (var i = 0, strLen = str.length; i < strLen; i++) {
			bufView[i] = str.charCodeAt(i);
		}
		return buf;
	}

	function smokeTest(url) {
		var Loader = require('../../src/loader.js'),
			Parser = require('../../src/parser.js');

		var loader = new Loader();

		loader.load(url, function(data) {
			var parser = new Parser();
			console.log(parser.parse(data));
		}, function(err) {
			console.log(err);
		});
	}

	return {
		ab2str: ab2str,
		str2ab: str2ab,
		smokeTest: smokeTest
	};
}

module.exports = testUtils();