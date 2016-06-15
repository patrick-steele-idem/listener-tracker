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

describe('client listener' , function() {
    var wrapped;
    var output;
    var event = createEvent("test");

    beforeEach(function() {
      output = [];
    });

    it('run', function() {
        expect(4).to.equal(4);
    });

    it('test on with window', function() {
        wrapped = listenerTracker.wrap(window);

        wrapped.on('test', function() {
            output.push('works');
        });

        window.dispatchEvent(event);

        expect(output).to.eql(['works']);
    });

    it('test removeListener with window', function() {
        wrapped.removeAllListeners('test');
        window.dispatchEvent(event);

        expect(output).to.eql([]);
    });

    it('event', function() {
        var e = createEvent('resize');
        expect(e).to.not.equal(null);
    });
});
