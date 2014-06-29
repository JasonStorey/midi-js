var Loader = require('../src/loader.js');

describe('Loader', function() {	
	beforeEach(function() {
		this.xhr = sinon.useFakeXMLHttpRequest();
		var requests = this.requests = [];
		this.xhr.onCreate = function (req) {
			requests.push(req);
		};
	});

	afterEach(function() {
		this.xhr.restore();
	});

	it('constructor should return a Loader', function() {
		var loader = new Loader();
		expect(loader).to.be.an.instanceof(Loader);
	});

	it('should call success callback with MIDI data', function() {
		var loader = new Loader(),
			successSpy = sinon.spy(),
			errorSpy = sinon.spy(),
			midiData = new ArrayBuffer(1024);

		this.xhr.prototype.response = midiData;

		loader.load('/test.mid', successSpy, errorSpy);
		
		expect(this.requests).to.have.length(1);
		
		this.requests[0].respond(200,  {'Content-Type':'binary/octet-stream'}, 'Midi data response text');
		
		expect(successSpy).to.have.been.calledOnce;		
		expect(successSpy).to.have.been.calledWith(midiData);
		expect(errorSpy).to.not.have.been.called;
	});

	it('should call error callback when request fails', function() {
		var loader = new Loader(),
			successSpy = sinon.spy(),
			errorSpy = sinon.spy(),
			emptyResponse = new ArrayBuffer(0);
		
		this.xhr.prototype.response = emptyResponse;

		loader.load('/test.mid', successSpy, errorSpy);
		expect(this.requests).to.have.length(1);

		this.requests[0].respond(404,  {}, '');

		expect(successSpy).to.not.have.been.called;
		expect(errorSpy).to.have.been.calledOnce;
		expect(errorSpy).to.have.been.calledWith(emptyResponse, 404, 'Not Found');
	});
});