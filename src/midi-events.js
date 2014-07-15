function midiEvents() {

	function parse(arrayBuffer) {
		var current = 0,
			events = [],
			dataView = new DataView(arrayBuffer);

		while(current < arrayBuffer.byteLength) {
			var event = {
				delta: dataView.getUint8(current),
				status: dataView.getUint8(current + 1)
			};
			
			if(event.status === 0xFF) {
				event.type = dataView.getUint8(current + 2);
				event.size = dataView.getUint8(current + 3);
				event.data1 = new Uint8Array(arrayBuffer.slice(current + 4, current + 4 + event.size));
				current = current + 4 + event.size;
			} else if(event.status >= 0xc0 && event.status <= 0xdf) {
				event.data1 = dataView.getUint8(current + 2);
				current = current + 3;
			} else {
				event.data1 = dataView.getUint8(current + 2);
				event.data2 = dataView.getUint8(current + 3);
				current = current + 4;
			}
			
			events.push(event);
		}

		return events;
	}

	return {
		parse: parse
	};
}

module.exports = midiEvents();