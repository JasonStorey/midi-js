function testBuffers() {
	var midi = {
		header: {
			chunkID: [0x4d,0x54,0x68,0x64],
			chunkSize: [0x00,0x00,0x00,0x06],
			type: [[0x00, 0x00], [0x00, 0x01], [0x00, 0x02]],
			numberOfTracks: [[0x00, 0x00], [0x00, 0x01], [0x00, 0x02]],
			timeDivision: {
				ticks: [0x00,0x78],
				frames: [0xe8,0x78]
			}
		},
		track: {
			chunkID: [0x4d,0x54,0x72,0x6b],
			chunkSize: [0x00,0x00,0x00,0x04],
			data: [0x01,0x03, 0x03,0x07]
		}
	};

	function createMidiBuffer(options) {
		var buffer = [].concat(
						midi.header.chunkID,
						midi.header.chunkSize,
						midi.header.type[options.type || 0],
						midi.header.numberOfTracks[options.tracks || 1]
					);

		if(options.frames) {
			buffer = buffer.concat(midi.header.timeDivision.frames);
		} else {
			buffer = buffer.concat(midi.header.timeDivision.ticks);
		}

		buffer = buffer.concat(
			midi.track.chunkID,
			midi.track.chunkSize,
			midi.track.data
		);

		return new Uint8Array(buffer).buffer;
	}

	return {
		createMidiBuffer: createMidiBuffer
	};
}

module.exports = testBuffers();