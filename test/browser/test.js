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
var tracker;
var TEST = "test";
var ONCE = "once";
var MESSAGE = "works";
var OUTPUT = [MESSAGE, ONCE];
var event = createEvent(TEST);
var onceEvent = createEvent(ONCE);
var testFunc = function() {
    output.push(MESSAGE);
};
var onceFunc = function() {
    output.push(ONCE);
};

describe('Non EventEmitter Wrap Suite' , function() {
    beforeEach(function() {
        output = [];
        wrapped = listenerTracker.wrap(window);
        wrapped.on(TEST, testFunc);
        wrapped.once(ONCE, onceFunc);
        window.dispatchEvent(event);
        window.dispatchEvent(onceEvent);
    });

    it('tests on', function() {
        expect(output).to.eql(OUTPUT);
    });

    it('tests once', function() {
        expect(output).to.eql(OUTPUT);
        window.dispatchEvent(onceEvent);
        expect(output).to.eql(OUTPUT);
    });

    it('tests removeAllListeners for event', function() {
        expect(output).to.eql(OUTPUT);

        wrapped.removeAllListeners(TEST);
        window.dispatchEvent(event);
        expect(output).to.eql(OUTPUT);
    });

    it('tests removeAllListeners', function() {
        expect(output).to.eql(OUTPUT);

        wrapped.removeAllListeners();
        window.dispatchEvent(event);
        expect(output).to.eql(OUTPUT);
    });
});

describe('Non EventEmitter Tracker Suite' , function() {
    beforeEach(function() {
        output = [];
        tracker = listenerTracker.createTracker();
        tracker.subscribeTo(window).on(TEST, testFunc);
        tracker.subscribeTo(window).once(ONCE, onceFunc);
        window.dispatchEvent(event);
        window.dispatchEvent(onceEvent);
    });

    it('tests on', function() {
        expect(output).to.eql(OUTPUT);
    });

    it('tests once', function() {
        expect(output).to.eql(OUTPUT);
        window.dispatchEvent(onceEvent);
        expect(output).to.eql(OUTPUT);
    });

    it('tests removeAllListeners for event', function() {
        expect(output).to.eql(OUTPUT);

        tracker.removeAllListeners();
        window.dispatchEvent(event);
        expect(output).to.eql(OUTPUT);
    });
});
