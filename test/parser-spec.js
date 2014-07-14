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

				expect(midiObject.tracks[0].events).to.be.defined;
				expect(midiObject.tracks[0].events.length).to.equal(4);
			});

			describe('Events', function() {
				describe('Meta events', function() {
					describe('Track name', function() {
						it('contains delta time', function() {
							var midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(midiObject.tracks[0].events[0].delta).to.equal(0);
						});

						it('contains status byte', function() {
							var expectedStatus = 0xff,
								midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(midiObject.tracks[0].events[0].status).to.equal(expectedStatus);
						});

						it('contains type byte', function() {
							var expectedType = 0x03,
								midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(midiObject.tracks[0].events[0].type).to.equal(expectedType);
						});

						it('contains size byte', function() {
							var expectedSize = 0x08,
								midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(midiObject.tracks[0].events[0].size).to.equal(expectedSize);
						});

						it('contains data1 byte', function() {
							var expectedTrackName = 'untitled',
								midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(String.fromCharCode.apply(null, midiObject.tracks[0].events[0].data1)).to.equal(expectedTrackName);
						});
					});

					describe('Copyright', function() {
						it('contains delta time', function() {
							var midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(midiObject.tracks[0].events[1].delta).to.equal(0);
						});

						it('contains status byte', function() {
							var expectedStatus = 0xff,
								midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(midiObject.tracks[0].events[1].status).to.equal(expectedStatus);
						});

						it('contains type byte', function() {
							var expectedType = 0x02,
								midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(midiObject.tracks[0].events[1].type).to.equal(expectedType);
						});

						it('contains size byte', function() {
							var expectedSize = 0x18,
								midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(midiObject.tracks[0].events[1].size).to.equal(expectedSize);
						});

						it('contains data1 byte', function() {
							var expectedCopyright = 'Copyright © 1998 by dave',
								midiObject = parser.parse(midiBufferWithOneTrackChunk);

							expect(String.fromCharCode.apply(null, midiObject.tracks[0].events[1].data1)).to.equal(expectedCopyright);
						});
					});
				});
				
				describe('Program change event', function() {
					it('contains delta time', function() {
						var midiObject = parser.parse(midiBufferWithOneTrackChunk);
						expect(midiObject.tracks[0].events[2].delta).to.equal(0);
					});
					
					it('contains status byte', function() {
						var expectedStatus = 0xc0,
							midiObject = parser.parse(midiBufferWithOneTrackChunk);

						expect(midiObject.tracks[0].events[2].status).to.equal(expectedStatus);
					});

					it('contains data1 byte', function() {
						var expectedData = 0x04,
							midiObject = parser.parse(midiBufferWithOneTrackChunk);

						expect(midiObject.tracks[0].events[2].data1).to.equal(expectedData);
					});
				});

				describe('Note on event', function() {
					it('contains delta time', function() {
						var midiObject = parser.parse(midiBufferWithOneTrackChunk);
						expect(midiObject.tracks[0].events[3].delta).to.equal(0);
					});
					
					it('contains status byte', function() {
						var expectedStatus = 0x90,
							midiObject = parser.parse(midiBufferWithOneTrackChunk);

						expect(midiObject.tracks[0].events[3].status).to.equal(expectedStatus);
					});

					it('contains data1 byte', function() {
						var expectedData = 0x29,
							midiObject = parser.parse(midiBufferWithOneTrackChunk);

						expect(midiObject.tracks[0].events[3].data1).to.equal(expectedData);
					});

					it('contains data2 byte', function() {
						var expectedData = 0x64,
							midiObject = parser.parse(midiBufferWithOneTrackChunk);

						expect(midiObject.tracks[0].events[3].data2).to.equal(expectedData);
					});
				});
			});
		});
	});
});