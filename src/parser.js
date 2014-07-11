var Parser = function Parser() {
};

Parser.prototype.parse = function parse(arrayBuffer) {
	var midiObject;

	this.validateArrayBuffer(arrayBuffer);
	this.arrayBuffer = arrayBuffer;
	this.dataView = new DataView(arrayBuffer);

	midiObject = {
		header: {
			chunkID: String.fromCharCode.apply(null, this.extractUint8Array(0, 4)),
			chunkSize: this.getUint32(4),
			formatType: this.getUint16(8),
			numberOfTracks: this.getUint16(10),
			timeDivision: this.getTimeDivisionObject()
		},
		tracks: this.getTracks()
	};

	return midiObject;
};

Parser.prototype.getTracks = function getTracks() {
	var tracksArray = [],
		numberOfTracks = this.getUint16(10),
		startByte = 14,
		headerSize = 8,
		chunk;
	
	for(var i = 0; i < numberOfTracks; i++) {
		chunk = this.getChunk(startByte);
		if(chunk.chunkID === 'MTrk') {
			tracksArray.push(chunk);
		} else {
			console.log('Unrecognised chunk : ', chunk);
		}
		startByte += (headerSize + chunk.chunkSize);
	}

	return tracksArray;
};

Parser.prototype.getChunk = function getChunk(offset) {
	var chunk = {
		chunkID: String.fromCharCode.apply(null, this.extractUint8Array(offset, offset + 4)),
		chunkSize: this.getUint32(offset + 4)
	};
	chunk.events = this.getEvents(offset + 8);
	return chunk;
};

Parser.prototype.getEvents = function getEvents(offset) {
	var events = [{
		delta: this.dataView.getUint8(offset),
		status: this.dataView.getUint8(offset + 1),
		type: this.dataView.getUint8(offset + 2),
		size: this.dataView.getUint8(offset + 3),
		data: this.extractUint8Array(offset + 4, offset + 4 + this.dataView.getUint8(offset + 3))
	}];

	return events;
};

Parser.prototype.getTimeDivisionObject = function getTimeDivisionObject() {
	var timeDivisionBytes = this.getUint16(12),
		topBit = (timeDivisionBytes & 0x8000) > 0 ? 1 : 0,
		timeDivisionObject = {
			type: topBit
		};

	if(topBit === 0) {
		timeDivisionObject.ticksPerBeat = timeDivisionBytes & 0x7FFF;
	} else {
		timeDivisionObject.framesPerSecond = ~ this.dataView.getInt8(12, false) + 1;
		timeDivisionObject.ticksPerFrame = timeDivisionBytes & 0x00FF;
	}

	return timeDivisionObject;
};

Parser.prototype.extractUint8Array = function extractUint8Array(start, end) {
	return new Uint8Array(this.arrayBuffer.slice(start, end));
};

Parser.prototype.getUint16 = function getUint16(offset) {
	return this.dataView.getUint16(offset, false);
};

Parser.prototype.getUint32 = function getUint32(offset) {
	return this.dataView.getUint32(offset, false);
};

Parser.prototype.validateArrayBuffer = function validateArrayBuffer(arrayBuffer) {
	if(!arrayBuffer.byteLength) {
		throw new Error('not a valid array buffer');
	}
	var midiChunkId = new Uint8Array(arrayBuffer.slice(0, 4));
	if(String.fromCharCode.apply(null, new Uint8Array(midiChunkId)) !== 'MThd') {
		throw new Error('invalid midi data');
	}
};

module.exports = Parser;