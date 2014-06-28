var expect = require('chai').expect,
	Loader = require('../src/loader.js');

describe('Loader', function() {
	it('constructor should return a Loader', function() {
		var loader = new Loader();
		expect(loader).to.be.an.instanceof(Loader);
	});
});