var Parser = require('../src/parser.js'),
	utils = require('./resources/test-utils');

describe('Parser', function() {
	var validMidiBuffer,
		invalidMidiBuffer;

	beforeEach(function() {
		validMidiBuffer = new Uint8Array([77,84,104,100,0,0,0,6]).buffer;
		invalidMidiBuffer = new Uint8Array([88,85,104,100]).buffer;
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
		expect(function(){ parser.parse(invalidMidiBuffer) }).to.throw('invalid midi data');
	});

	it('should cache valid midi buffer', function() {
		var parser = new Parser();
		
		expect(parser.arrayBuffer).to.be.undefined;
		parser.parse(validMidiBuffer);
		expect(parser.arrayBuffer).to.equal(validMidiBuffer);
	});

	it('should return a midi object with a header', function() {
		var parser = new Parser(),
			expectedChunkID = new Uint8Array([77,84,104,100]),
			expectedChunSize = new Uint8Array([0,0,0,6]),
			midiObject;
		
		midiObject = parser.parse(validMidiBuffer);
		expect(midiObject.header.chunkID).to.deep.equal(expectedChunkID);
		expect(midiObject.header.chunkSize).to.deep.equal(expectedChunSize);
	});
});