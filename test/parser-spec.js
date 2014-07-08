var Parser = require('../src/parser.js'),
	utils = require('./resources/test-utils');

describe('Parser', function() {
	var typeZeroMidiBufferWithTicks,
		invalidMidiBuffer;

	beforeEach(function() {
		typeZeroMidiBufferWithTicks = new Uint8Array([77,84,104,100,0,0,0,6,0,0,0,1,0,120]).buffer;
		typeZeroMidiBufferWithFrames = new Uint8Array([77,84,104,100,0,0,0,6,0,0,0,1,232,120]).buffer;
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
		parser.parse(typeZeroMidiBufferWithTicks);
		expect(parser.arrayBuffer).to.equal(typeZeroMidiBufferWithTicks);
	});

	describe('returns a midi object with a header', function() {
		it('containing a chunkID', function() {
			var parser = new Parser(),
				expectedChunkID = 'MThd',
				midiObject;
			
			midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			expect(midiObject.header.chunkID).to.equal(expectedChunkID);
		});

		it('containing a chunkSize', function() {
			var parser = new Parser(),
				expectedChunkSize = 6,
				midiObject;
			
			midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			expect(midiObject.header.chunkSize).to.deep.equal(expectedChunkSize);
		});

		it('containing a formatType', function() {
			var parser = new Parser(),
				expectedFormatType = 0,
				midiObject;
			
			midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			expect(midiObject.header.formatType).to.equal(expectedFormatType);
		});

		it('containing numberOfTracks', function() {
			var parser = new Parser(),
				expectedNumberOfTracks = 1,
				midiObject;
			
			midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			expect(midiObject.header.numberOfTracks).to.equal(expectedNumberOfTracks);
		});

		it('containing timeDivision with ticksPerBeat', function() {
			var parser = new Parser(),
				expectedTimeDivision = {
					type: 0,
					ticksPerBeat: 120
				},
				midiObject;
			
			midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			expect(midiObject.header.timeDivision).to.deep.equal(expectedTimeDivision);
		});

		it('containing timeDivision with framesPerSecond and ticksPerFrame', function() {
			var parser = new Parser(),
				expectedTimeDivision = {
					type: 1,
					framesPerSecond: 24,
					ticksPerFrame: 120
				},
				midiObject;
			
			midiObject = parser.parse(typeZeroMidiBufferWithFrames);
			expect(midiObject.header.timeDivision).to.deep.equal(expectedTimeDivision);
		});
	});
});