/**
 * Created by jason on 12/27/13.
 */

(function(){
    "use strict";

    function WaitFor(fn, options) {
        options = options || {};

        this.pending = 0;
        this.callback = [];
        this.options = {
            immediate: options.immediate || false
        };
        if (fn) {
            this.callback.push(fn);
        }
    }

    WaitFor.prototype.$processEvent = function(){
        if (this.pending <= 0) {
            throw 'WaitFor: Event Processing Error';
        }

        --this.pending;

        this.$try();
    };

    WaitFor.prototype.add = function(fn, fnThis) {
        var self = this;
        var triggered = false;

        this.pending += 1;

        return function(){
            if (triggered) {
                throw 'WaitFor: Already called';
            }

            triggered = true;

            var fThis = fnThis || this;

            var r = fn.apply(fThis, arguments);

            self.$processEvent();
        };
    };

    WaitFor.prototype.$try = function() {
        if (!this.pending) {
            var self = this;
            if (this.options.immediate) {
                self.$trigger();
            } else {
                process.nextTick(function(){
                    self.$trigger();
                });
            }
        }
    };

    WaitFor.prototype.$trigger = function () {
        if (!this.pending) {
            this.callback.forEach(function(fn,i,a){
                fn();
            });
        }
    };

    WaitFor.prototype.onReady = function(fn) {
        this.callback.push(fn);
        this.$try();
    };

    module.exports = WaitFor;
}());