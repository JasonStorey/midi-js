var Parser = require('../src/parser.js'),
	testBuffers = require('./resources/test-buffers.js');

describe('Parser', function() {
	var typeZeroMidiBufferWithTicks,
		invalidMidiBuffer;

	beforeEach(function() {
		typeZeroMidiBufferWithTicks  = testBuffers.createMidiBuffer({type:0, ticks: true});
		typeZeroMidiBufferWithFrames = testBuffers.createMidiBuffer({type:0, frames: true});
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

	describe('returns a midi object with track chunk', function() {
		it('containing a chunkID', function() {
			var parser = new Parser(),
				expectedChunkID = 'MTrk',
				midiObject;

			midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			expect(midiObject.tracks[0].chunkID).to.equal(expectedChunkID);
		});

		it('containing a chunkSize', function() {
			var parser = new Parser(),
				expectedChunkSize = 4,
				midiObject;

			midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			expect(midiObject.tracks[0].chunkSize).to.equal(expectedChunkSize);
		});

		it('containing chunk data', function() {
			var parser = new Parser(),
				expectedChunkData = new Uint8Array([0x01,0x03,0x03,0x07]),
				midiObject;

			midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			expect(midiObject.tracks[0].data).to.deep.equal(expectedChunkData);
		});
	});
});