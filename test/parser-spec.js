var Parser = require('../src/parser.js');

describe('Parser', function() {
	var validMidiData,
		invalidMidiData;

	beforeEach(function(){
		validMidiData = getBuffer('MThd');
		invalidMidiData = getBuffer('invalid data');
	});

	it('constructor should return an instance of Parser', function() {
		var parser = new Parser();
		expect(parser).to.be.an.instanceof(Parser);
	});

	it('should throw error if array buffer is invalid', function() {
		var parser = new Parser(),
			arrayBuffer = ['not an array buffer'];

		expect(function(){ parser.parse(arrayBuffer) }).to.throw('not a valid array buffer');
	});

	it('should throw error if array buffer does not contain MIDI data', function() {
		var parser = new Parser();
		expect(function(){ parser.parse(invalidMidiData) }).to.throw('invalid midi data');
	});

	it('should cache valid midi buffer', function() {
		var parser = new Parser();
		
		expect(parser.arrayBuffer).to.be.undefined;
		parser.parse(validMidiData);
		expect(parser.arrayBuffer).to.equal(validMidiData);
	});
});

function getBuffer(str) {
	var buf = new ArrayBuffer(str.length * 2),
		bufView = new Uint16Array(buf);

	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}