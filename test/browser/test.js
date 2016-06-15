/* globals document, window */
'use strict';

var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;
var listenerTracker = require('./../..');

var createEvent = function(type) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent(type, true, true);
    return event;
};

var wrapped;
var output;
var TEST = "test";
var MESSAGE = "works";
var OUTPUT = [MESSAGE];
var event = createEvent(TEST);
var testFunc = function() {
    output.push(MESSAGE);
};

describe('Non EventEmitter Suite' , function() {
    beforeEach(function() {
        output = [];
        wrapped = listenerTracker.wrap(window);
        wrapped.on(TEST, testFunc);
        window.dispatchEvent(event);
    });

    it('tests on', function() {
        expect(output).to.eql(OUTPUT);
    });

    it('tests removeListeners for event', function() {
        expect(output).to.eql(OUTPUT);

        wrapped.removeAllListeners(TEST);
        window.dispatchEvent(event);
        expect(output).to.eql(OUTPUT);
    });

    it('tests removeListeners', function() {
        expect(output).to.eql(OUTPUT);

        wrapped.removeAllListeners();
        window.dispatchEvent(event);
        expect(output).to.eql(OUTPUT);
    });
});
