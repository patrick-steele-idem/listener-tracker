/* globals document, window */
'use strict';

var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;
var EventEmitter = require('events').EventEmitter;
var listenerTracker = require('./../..');

var createEvent = function(type) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent(type, true, true);
    return event;
};

var addListener = function(target, type, listener) {
  target.on(type, listener);
};

var wrapped;
var output;
var testFunc = function() {
    output.push('works');
};

describe('client listener' , function() {
    beforeEach(function() {
        output = [];
        wrapped = listenerTracker.wrap(window);
    });

    it('run', function() {
        expect(4).to.equal(4);
    });

    it('test on with window', function() {
        var event = createEvent("test");
        addListener(wrapped, 'test', testFunc);
        window.dispatchEvent(event);

        expect(output).to.eql(['works']);
    });

    it('test removeListeners for event with window', function() {
        var event = createEvent("test2");
        addListener(wrapped, 'test2', testFunc);
        window.dispatchEvent(event);
        expect(output).to.eql(['works']);
        output = [];

        wrapped.removeAllListeners('test2');
        window.dispatchEvent(event);
        expect(output).to.eql([]);
    });

    it('test removeListeners with window', function() {
        // addListener(wrapped, 'test', testFunc);
        // window.dispatchEvent(event);
        //
        // expect(output).to.eql(['works']);
    });

    it('event', function() {
        var e = createEvent('resize');
        expect(e).to.not.equal(null);
    });
});
