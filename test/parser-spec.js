var Parser = require('../src/parser.js'),
	testBuffers = require('./resources/test-buffers.js');

describe('Parser', function() {
	var parser,
		typeZeroMidiBufferWithTicks,
		typeZeroMidiBufferWithFrames,
		invalidMidiBuffer;

	beforeEach(function() {
		parser = new Parser();
		typeZeroMidiBufferWithTicks  = testBuffers.createMidiBuffer({type: 0, tracks: 1, ticks: true});
		typeZeroMidiBufferWithFrames = testBuffers.createMidiBuffer({type:0, tracks: 1, frames: true});
		invalidMidiBuffer = new Uint8Array([88,85,104,100]).buffer;
	});

	it('constructor should return an instance of Parser', function() {
		expect(parser).to.be.an.instanceof(Parser);
	});

	it('should throw error if array buffer is invalid', function() {
		var arrayBuffer = ['not an array buffer'];
		expect(function(){ parser.parse(arrayBuffer) }).to.throw('not a valid array buffer');
	});

	it('should throw error if array buffer does not contain MIDI data', function() {
		expect(function(){ parser.parse(invalidMidiBuffer) }).to.throw('invalid midi data');
	});

	it('should cache valid midi buffer', function() {				
		expect(parser.arrayBuffer).to.be.undefined;
		parser.parse(typeZeroMidiBufferWithTicks);
		expect(parser.arrayBuffer).to.equal(typeZeroMidiBufferWithTicks);
	});

	describe('returns a midi object with a header', function() {
		it('containing a chunkID', function() {
			var expectedChunkID = 'MThd',
				midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			
			expect(midiObject.header.chunkID).to.equal(expectedChunkID);
		});

		it('containing a chunkSize', function() {
			var expectedChunkSize = 6,
				midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			
			expect(midiObject.header.chunkSize).to.deep.equal(expectedChunkSize);
		});

		it('containing a formatType', function() {
			var expectedFormatType = 0,
				midiObject = parser.parse(typeZeroMidiBufferWithTicks);
			
			expect(midiObject.header.formatType).to.equal(expectedFormatType);
		});

		it('containing numberOfTracks', function() {
			var expectedNumberOfTracks = 1,
				midiObject = parser.parse(typeZeroMidiBufferWithTicks);

			expect(midiObject.header.numberOfTracks).to.equal(expectedNumberOfTracks);
		});

		it('containing timeDivision with ticksPerBeat', function() {
			var expectedTimeDivision = {
					type: 0,
					ticksPerBeat: 120
				},
				midiObject = parser.parse(typeZeroMidiBufferWithTicks);

			expect(midiObject.header.timeDivision).to.deep.equal(expectedTimeDivision);
		});

		it('containing timeDivision with framesPerSecond and ticksPerFrame', function() {
			var expectedTimeDivision = {
					type: 1,
					framesPerSecond: 24,
					ticksPerFrame: 120
				},
				midiObject = parser.parse(typeZeroMidiBufferWithFrames);

			expect(midiObject.header.timeDivision).to.deep.equal(expectedTimeDivision);
		});
	});

	describe('returns a midi object with tracks array', function() {
		var midiBufferWithOneTrackChunk,
			midiBufferWith2TracksAnd2ProprietaryChunks;

		beforeEach(function() {
			midiBufferWithOneTrackChunk = testBuffers.createMidiBuffer({type:0, tracks: 1, ticks: true});
			midiBufferWith2TracksAnd2ProprietaryChunks = testBuffers.createMidiBuffer({type:1, tracks: 2, ticks: true, propietaryChunks: 2});
		});

		it('containing valid tracks only', function() {
			var expectedChunkID = 'MTrk',
				midiObject = parser.parse(midiBufferWith2TracksAnd2ProprietaryChunks);

			expect(midiObject.tracks.length).to.equal(2);
			expect(midiObject.tracks[0].chunkID).to.equal(expectedChunkID);
		});

		describe('Tracks', function() {
			it('contain a valid chunkID', function() {
				var expectedChunkID = 'MTrk',
					midiObject = parser.parse(midiBufferWithOneTrackChunk);

				expect(midiObject.tracks.length).to.equal(1);
				expect(midiObject.tracks[0].chunkID).to.equal(expectedChunkID);
			});

			it('contain a chunkSize', function() {
				var expectedChunkSize = 47,
					midiObject = parser.parse(midiBufferWithOneTrackChunk);

				expect(midiObject.tracks[0].chunkSize).to.equal(expectedChunkSize);
			});

			it('contain chunk events', function() {
				var midiObject = parser.parse(midiBufferWithOneTrackChunk);

				// TODO: this uses the real midi-events module... should stub with proxyquire?

				expect(midiObject.tracks[0].events).to.be.defined;
				expect(midiObject.tracks[0].events.length).to.equal(4);
			});

		});
	});
});