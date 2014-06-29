var Parser = require('../src/parser.js');

describe('Parser', function() {	
	it('constructor should return an instance of Parser', function() {
		var parser = new Parser();
		expect(parser).to.be.an.instanceof(Parser);
	});
});