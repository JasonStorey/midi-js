#!/bin/bash

mkdir -p ./test/resources/lib

cp	./node_modules/mocha/mocha.css \
  	./node_modules/mocha/mocha.js \
	./node_modules/chai/chai.js \
	./node_modules/sinon/pkg/sinon.js \
	./node_modules/sinon-chai/lib/sinon-chai.js \
	./test/resources/lib/

browserify ./test/loader-spec.js > ./test/resources/test-bundle.js;