var Parser = function Parser() {
};

Parser.prototype.parse = function parse(arrayBuffer) {
	this.validateArrayBuffer(arrayBuffer);

	this.arrayBuffer = arrayBuffer;
};

Parser.prototype.validateArrayBuffer = function validateArrayBuffer(arrayBuffer) {
	if(!arrayBuffer.byteLength) {
		throw new Error('not a valid array buffer');
	}
	var midiChunkId = new Uint16Array(arrayBuffer.slice(0, 8));
	if(String.fromCharCode.apply(null, new Uint16Array(midiChunkId)) !== 'MThd') {
		throw new Error('invalid midi data');
	}
}

module.exports = Parser;