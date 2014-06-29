var Parser = function Parser() {
};

Parser.prototype.parse = function parse(arrayBuffer) {
	var midiObject;

	this.validateArrayBuffer(arrayBuffer);
	this.arrayBuffer = arrayBuffer;
	
	midiObject = {
		header: {
			chunkID: this.extract(0, 8)
		}
	};

	return midiObject;
};

Parser.prototype.extract = function extract(start, end) {
	return new Uint16Array(this.arrayBuffer.slice(start, end));
};

Parser.prototype.validateArrayBuffer = function validateArrayBuffer(arrayBuffer) {
	if(!arrayBuffer.byteLength) {
		throw new Error('not a valid array buffer');
	}
	var midiChunkId = new Uint16Array(arrayBuffer.slice(0, 8));
	if(String.fromCharCode.apply(null, new Uint16Array(midiChunkId)) !== 'MThd') {
		throw new Error('invalid midi data');
	}
};

module.exports = Parser;