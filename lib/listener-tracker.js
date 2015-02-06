var INDEX_EVENT = 0;
var INDEX_LISTENER = 1;

function EventEmitterWrapper(target) {
    this._target = target;
    this._listeners = [];
}

EventEmitterWrapper.prototype = {
    _proxy: function(type, event, listener) {
        this._target[type](event, listener);
        this._listeners.push([event, listener]);
        return this;
    },

    _remove: function(test) {
        var target = this._target;
        var listeners = this._listeners;

        this._listeners = listeners.filter(function(listener) {
            var event = listener[INDEX_EVENT];
            var listenerFunc = listener[INDEX_LISTENER];

            if (test(event, listenerFunc)) {
                target.removeListener(event, listenerFunc);
                return false;

            } else {
                return true;
            }
        });
    },

    on: function(event, listener) {
        return this._proxy('on', event, listener);
    },

    once: function(event, listener) {
        return this._proxy('once', event, listener);
    },

    removeListener: function(event, listener) {
        if (typeof event === 'function') {
            listener = event;
            event = null;
        }

        if (listener && event) {
            this._remove(function(curEvent, curListener) {
                return event === curEvent && listener === curListener;
            });
        } else if (listener) {
            this._remove(function(curEvent, curListener) {
                return listener === curListener;
            });
        } else if (event) {
            this.removeAllListeners(event);
        }

        return this;
    },

    removeAllListeners: function(event) {

        var listeners = this._listeners;
        var target = this._target;

        if (event) {
            this._remove(function(curEvent, curListener) {
                return event === curEvent;
            });
        } else {
            for (var i = listeners.length - 1; i >= 0; i--) {
                var cur = listeners[i];
                target.removeListener(cur[INDEX_EVENT], cur[INDEX_LISTENER]);
            }
            this._listeners.length = 0;
        }

        return this;
    }
};

EventEmitterWrapper.prototype.addListener = EventEmitterWrapper.prototype.on;

function SubscriptionTracker() {
    this._subscribeToList = [];
}

SubscriptionTracker.prototype = {

    subscribeTo: function(target) {
        var wrapper;
        var subscribeToList = this._subscribeToList;

        for (var i=0, len=subscribeToList.length; i<len; i++) {
            var cur = subscribeToList[i];
            if (cur._target === target) {
                wrapper = cur;
                break;
            }
        }

        if (!wrapper) {
            wrapper = new EventEmitterWrapper(target);
            wrapper.once('destroy', function() {
                wrapper.removeAllListeners();

                for (var i = subscribeToList.length - 1; i >= 0; i--) {
                    if (subscribeToList[i]._target === target) {
                        subscribeToList.splice(i, 1);
                        break;
                    }
                }
            });
            subscribeToList.push(wrapper);
        }

        return wrapper;
    },

    removeAllListeners: function(target, event) {
        var subscribeToList = this._subscribeToList;
        var i;

        if (target) {
            for (i = subscribeToList.length - 1; i >= 0; i--) {
                var cur = subscribeToList[i];
                if (cur._target === target) {
                    cur.removeAllListeners(event);

                    if (!cur._listeners.length) {
                        // Do some cleanup if we removed all
                        // listeners for the target event emitter
                        subscribeToList.splice(i, 1);
                    }

                    break;
                }
            }
        } else {

            for (i = subscribeToList.length - 1; i >= 0; i--) {
                subscribeToList[i].removeAllListeners();
            }
            subscribeToList.length = 0;
        }
    }
};

exports.wrap = function(targetEventEmitter) {
    var wrapper = new EventEmitterWrapper(targetEventEmitter);
    targetEventEmitter.once('destroy', function() {
        wrapper._listeners.length = 0;
    });
    return wrapper;
};

exports.createTracker = function() {
    return new SubscriptionTracker();
};