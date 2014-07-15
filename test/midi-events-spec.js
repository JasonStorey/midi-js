var midiEvents = require('../src/midi-events.js'),
	testBuffers = require('./resources/test-buffers.js');

describe('Midi Events', function() {
	var bufferWith4Events;

	beforeEach(function() {
		bufferWith4Events = testBuffers.createEventsBuffer();
	});

	it('parses array of events from buffer', function() {
		var events = midiEvents.parse(bufferWith4Events);

		expect(events).to.be.defined;
		expect(events.length).to.equal(4);
	});

	describe('Meta events', function() {
		describe('Track name', function() {
			it('contains delta time', function() {
				var events = midiEvents.parse(bufferWith4Events);

				expect(events[0].delta).to.equal(0);
			});

			it('contains status byte', function() {
				var expectedStatus = 0xff,
					events = midiEvents.parse(bufferWith4Events);

				expect(events[0].status).to.equal(expectedStatus);
			});

			it('contains type byte', function() {
				var expectedType = 0x03,
					events = midiEvents.parse(bufferWith4Events);

				expect(events[0].type).to.equal(expectedType);
			});

			it('contains size byte', function() {
				var expectedSize = 0x08,
					events = midiEvents.parse(bufferWith4Events);

				expect(events[0].size).to.equal(expectedSize);
			});

			it('contains data1 byte', function() {
				var expectedTrackName = 'untitled',
					events = midiEvents.parse(bufferWith4Events);

				expect(String.fromCharCode.apply(null, events[0].data1)).to.equal(expectedTrackName);
			});
		});

		describe('Copyright', function() {
			it('contains delta time', function() {
				var events = midiEvents.parse(bufferWith4Events);

				expect(events[1].delta).to.equal(0);
			});

			it('contains status byte', function() {
				var expectedStatus = 0xff,
					events = midiEvents.parse(bufferWith4Events);

				expect(events[1].status).to.equal(expectedStatus);
			});

			it('contains type byte', function() {
				var expectedType = 0x02,
					events = midiEvents.parse(bufferWith4Events);

				expect(events[1].type).to.equal(expectedType);
			});

			it('contains size byte', function() {
				var expectedSize = 0x18,
					events = midiEvents.parse(bufferWith4Events);

				expect(events[1].size).to.equal(expectedSize);
			});

			it('contains data1 byte', function() {
				var expectedCopyright = 'Copyright © 1998 by dave',
					events = midiEvents.parse(bufferWith4Events);

				expect(String.fromCharCode.apply(null, events[1].data1)).to.equal(expectedCopyright);
			});
		});
	});
	
	describe('Program change event', function() {
		it('contains delta time', function() {
			var events = midiEvents.parse(bufferWith4Events);
			expect(events[2].delta).to.equal(0);
		});
		
		it('contains status byte', function() {
			var expectedStatus = 0xc0,
				events = midiEvents.parse(bufferWith4Events);

			expect(events[2].status).to.equal(expectedStatus);
		});

		it('contains data1 byte', function() {
			var expectedData = 0x04,
				events = midiEvents.parse(bufferWith4Events);

			expect(events[2].data1).to.equal(expectedData);
		});
	});

	describe('Note on event', function() {
		it('contains delta time', function() {
			var events = midiEvents.parse(bufferWith4Events);
			expect(events[3].delta).to.equal(0);
		});
		
		it('contains status byte', function() {
			var expectedStatus = 0x90,
				events = midiEvents.parse(bufferWith4Events);

			expect(events[3].status).to.equal(expectedStatus);
		});

		it('contains data1 byte', function() {
			var expectedData = 0x29,
				events = midiEvents.parse(bufferWith4Events);

			expect(events[3].data1).to.equal(expectedData);
		});

		it('contains data2 byte', function() {
			var expectedData = 0x64,
				events = midiEvents.parse(bufferWith4Events);

			expect(events[3].data2).to.equal(expectedData);
		});
	});
});