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
			numberOfTracks: this.getUint16(10)
		}
	};

	return midiObject;
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