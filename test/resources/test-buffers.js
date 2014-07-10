function testBuffers() {
	var midi = {
		header: {
			chunkID: [0x4d,0x54,0x68,0x64],
			chunkSize: [0x00,0x00,0x00,0x06],
			type: [[0x00, 0x00], [0x00, 0x01], [0x00, 0x02]],
			timeDivision: {
				ticks: [0x00,0x78],
				frames: [0xe8,0x78]
			}
		},
		track: {
			chunkID: [0x4d,0x54,0x72,0x6b],
			proprietaryChunkID: [0x4d,0x54,0x6a,0x73],
			chunkSize: [0x00,0x00,0x00,0x0c],
			events: {
				delta: [0x00],
				trackName: [0xff,0x03,0x08,0x75,0x6e,0x74,0x69,0x74,0x6c,0x65,0x64]
			}
		}
	};

	function getChunkSizeArray() {

	}

	function createNumberOfTracksArray(options) {
		var n = (options.tracks + (options.propietaryChunks || 0)) || 1;
		return [0x00, n];
	}

	function createTimeDivisionArray(options) {
		if(options.frames) {
			return midi.header.timeDivision.frames;
		}
		return midi.header.timeDivision.ticks;
	}

	function createMidiBuffer(options) {
		var buffer = [].concat(
						midi.header.chunkID,
						midi.header.chunkSize,
						midi.header.type[options.type || 0],
						createNumberOfTracksArray(options),
						createTimeDivisionArray(options)
					);

		for (var i = 0; i < (options.propietaryChunks || 0); i++) {
			buffer = buffer.concat(
				midi.track.proprietaryChunkID,
				midi.track.chunkSize,
				midi.track.events.delta,
				midi.track.events.trackName
			);		
		};

		for (var j = 0; j < (options.tracks || 1); j++) {
			buffer = buffer.concat(
				midi.track.chunkID,
				midi.track.chunkSize,
				midi.track.events.delta,
				midi.track.events.trackName
			);		
		};

		return new Uint8Array(buffer).buffer;
	}

	return {
		createMidiBuffer: createMidiBuffer
	};
}

module.exports = testBuffers();