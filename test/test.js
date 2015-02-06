'use strict';
var chai = require('chai');
chai.config.includeStack = true;
var expect = require('chai').expect;
var EventEmitter = require('events').EventEmitter;

var listenerTracker = require('../');

describe('listener-tracker' , function() {

    beforeEach(function(done) {
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        done();
    });

    it('should handle removing all correctly for a single wrapped instance', function() {
        var ee = new EventEmitter();
        var wrapped = listenerTracker.wrap(ee);

        var output = [];

        wrapped.on('foo', function() {
            output.push('foo-wrapped');
        });

        wrapped.on('bar', function() {
            output.push('bar-wrapped');
        });

        ee.on('foo', function() {
            output.push('foo');
        });

        ee.on('bar', function() {
            output.push('bar');
        });

        ee.emit('foo');
        ee.emit('bar');
        expect(output).to.deep.equal(['foo-wrapped', 'foo', 'bar-wrapped', 'bar']);

        wrapped.removeAllListeners();

        ee.emit('foo');
        ee.emit('bar');
        expect(output).to.deep.equal(['foo-wrapped', 'foo', 'bar-wrapped', 'bar', 'foo', 'bar']);
    });

    it('should handle removing all for a specific event correctly for a single wrapped instance', function() {
        var ee = new EventEmitter();
        var wrapped = listenerTracker.wrap(ee);

        var output = [];

        wrapped.on('foo', function() {
            output.push('foo-wrapped');
        });

        wrapped.on('bar', function() {
            output.push('bar-wrapped');
        });

        ee.on('foo', function() {
            output.push('foo');
        });

        ee.on('bar', function() {
            output.push('bar');
        });


        ee.emit('foo');
        ee.emit('bar');
        expect(output).to.deep.equal(['foo-wrapped', 'foo', 'bar-wrapped', 'bar']);

        wrapped.removeAllListeners('bar');

        ee.emit('foo');
        ee.emit('bar');
        expect(output).to.deep.equal(['foo-wrapped', 'foo', 'bar-wrapped', 'bar', 'foo-wrapped', 'foo', 'bar']);
    });

    it('should handle removing all correctly for multiple emitters', function() {


        var tracker = listenerTracker.createTracker();
        var ee1 = new EventEmitter();
        var ee2 = new EventEmitter();

        var output = [];

        tracker.subscribeTo(ee1)
            .on('foo', function() {
                output.push('ee1:foo-wrapped');
            })
            .on('bar', function() {
                output.push('ee1:bar-wrapped');
            });

        tracker.subscribeTo(ee2)
            .on('foo', function() {
                output.push('ee2:foo-wrapped');
            })
            .on('bar', function() {
                output.push('ee2:bar-wrapped');
            });

        ee1
            .on('foo', function() {
                output.push('ee1:foo');
            })
            .on('bar', function() {
                output.push('ee1:bar');
            });

        ee2
            .on('foo', function() {
                output.push('ee2:foo');
            })
            .on('bar', function() {
                output.push('ee2:bar');
            });

        ee1.emit('foo');
        ee2.emit('foo');
        ee1.emit('bar');
        ee2.emit('bar');

        expect(output).to.deep.equal([
            'ee1:foo-wrapped', 'ee1:foo', 'ee2:foo-wrapped', 'ee2:foo',
            'ee1:bar-wrapped', 'ee1:bar', 'ee2:bar-wrapped', 'ee2:bar']);

        tracker.removeAllListeners();

        ee1.emit('foo');
        ee2.emit('foo');
        ee1.emit('bar');
        ee2.emit('bar');

        expect(output).to.deep.equal([
            'ee1:foo-wrapped', 'ee1:foo', 'ee2:foo-wrapped', 'ee2:foo',
            'ee1:bar-wrapped', 'ee1:bar', 'ee2:bar-wrapped', 'ee2:bar',
            'ee1:foo', 'ee2:foo',
            'ee1:bar', 'ee2:bar']);
    });

    it('should handle removing all from one emitter correctly for multiple emitters', function() {


        var tracker = listenerTracker.createTracker();
        var ee1 = new EventEmitter();
        var ee2 = new EventEmitter();

        var output = [];

        tracker.subscribeTo(ee1)
            .on('foo', function() {
                output.push('ee1:foo-wrapped');
            })
            .on('bar', function() {
                output.push('ee1:bar-wrapped');
            });

        tracker.subscribeTo(ee2)
            .on('foo', function() {
                output.push('ee2:foo-wrapped');
            })
            .on('bar', function() {
                output.push('ee2:bar-wrapped');
            });

        ee1
            .on('foo', function() {
                output.push('ee1:foo');
            })
            .on('bar', function() {
                output.push('ee1:bar');
            });

        ee2
            .on('foo', function() {
                output.push('ee2:foo');
            })
            .on('bar', function() {
                output.push('ee2:bar');
            });

        ee1.emit('foo');
        ee2.emit('foo');
        ee1.emit('bar');
        ee2.emit('bar');

        expect(output).to.deep.equal([
            'ee1:foo-wrapped', 'ee1:foo', 'ee2:foo-wrapped', 'ee2:foo',
            'ee1:bar-wrapped', 'ee1:bar', 'ee2:bar-wrapped', 'ee2:bar']);

        tracker.removeAllListeners(ee1);

        ee1.emit('foo');
        ee2.emit('foo');
        ee1.emit('bar');
        ee2.emit('bar');

        expect(output).to.deep.equal([
            'ee1:foo-wrapped', 'ee1:foo', 'ee2:foo-wrapped', 'ee2:foo',
            'ee1:bar-wrapped', 'ee1:bar', 'ee2:bar-wrapped', 'ee2:bar',
            'ee1:foo', 'ee2:foo-wrapped', 'ee2:foo',
            'ee1:bar', 'ee2:bar-wrapped', 'ee2:bar']);
    });

    it('should handle removing all from one emitter for specific event correctly for multiple emitters', function() {


        var tracker = listenerTracker.createTracker();
        var ee1 = new EventEmitter();
        var ee2 = new EventEmitter();

        var output = [];

        tracker.subscribeTo(ee1)
            .on('foo', function() {
                output.push('ee1:foo-wrapped');
            })
            .on('bar', function() {
                output.push('ee1:bar-wrapped');
            });

        tracker.subscribeTo(ee2)
            .on('foo', function() {
                output.push('ee2:foo-wrapped');
            })
            .on('bar', function() {
                output.push('ee2:bar-wrapped');
            });

        ee1
            .on('foo', function() {
                output.push('ee1:foo');
            })
            .on('bar', function() {
                output.push('ee1:bar');
            });

        ee2
            .on('foo', function() {
                output.push('ee2:foo');
            })
            .on('bar', function() {
                output.push('ee2:bar');
            });

        ee1.emit('foo');
        ee2.emit('foo');
        ee1.emit('bar');
        ee2.emit('bar');

        expect(output).to.deep.equal([
            'ee1:foo-wrapped', 'ee1:foo', 'ee2:foo-wrapped', 'ee2:foo',
            'ee1:bar-wrapped', 'ee1:bar', 'ee2:bar-wrapped', 'ee2:bar']);

        tracker.removeAllListeners(ee1, 'foo');

        ee1.emit('foo');
        ee2.emit('foo');
        ee1.emit('bar');
        ee2.emit('bar');

        expect(output).to.deep.equal([
            'ee1:foo-wrapped', 'ee1:foo', 'ee2:foo-wrapped', 'ee2:foo',
            'ee1:bar-wrapped', 'ee1:bar', 'ee2:bar-wrapped', 'ee2:bar',
            'ee1:foo', 'ee2:foo-wrapped', 'ee2:foo',
            'ee1:bar-wrapped', 'ee1:bar', 'ee2:bar-wrapped', 'ee2:bar']);
    });

    it('should handle destroy for a single emitter', function() {
        var ee = new EventEmitter();
        var wrapped = listenerTracker.wrap(ee);

        var output = [];

        wrapped.on('foo', function() {
            output.push('foo-wrapped');
        });

        wrapped.on('bar', function() {
            output.push('bar-wrapped');
        });

        expect(wrapped._listeners.length).to.equal(2);
        ee.emit('destroy');
        expect(wrapped._listeners.length).to.equal(0);
    });

    it('should handle destroy for multiple emitters', function() {


        var tracker = listenerTracker.createTracker();
        var ee1 = new EventEmitter();
        var ee2 = new EventEmitter();

        var output = [];

        tracker.subscribeTo(ee1)
            .on('foo', function() {
                output.push('ee1:foo-wrapped');
            })
            .on('bar', function() {
                output.push('ee1:bar-wrapped');
            });

        tracker.subscribeTo(ee2)
            .on('foo', function() {
                output.push('ee2:foo-wrapped');
            })
            .on('bar', function() {
                output.push('ee2:bar-wrapped');
            });

        expect(tracker._subscribeToList.length).to.equal(2);
        ee1.emit('destroy');
        expect(tracker._subscribeToList.length).to.equal(1);

    });

    it('should auto-unsubscribe when target is destroyed', function() {


        var tracker = listenerTracker.createTracker();
        var ee = new EventEmitter();

        var fooEvent = null;

        tracker.subscribeTo(ee)
            .on('foo', function() {
                fooEvent = arguments;
            });

        ee.emit('foo', 'a', 'b');

        expect(fooEvent[0]).to.equal('a');
        expect(fooEvent[1]).to.equal('b');

        fooEvent = null;

        ee.emit('destroy');

        ee.emit('foo', 'a', 'b');

        expect(fooEvent).to.equal(null);
    });

});