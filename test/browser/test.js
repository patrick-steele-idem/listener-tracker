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
    it('run', function() {
        expect(4).to.equal(4);
    });

    it('test', function() {
        var event = createEvent("test");
        var wrapped = listenerTracker.wrap(window);

        var output = [];

        wrapped.on('test', function() {
            output.push('works');
        });

        window.dispatchEvent(event);

        expect(output).to.eql(['works']);
    });

    it('event', function() {
        var e = createEvent('resize');
        expect(e).to.not.equal(null);
    });
});
