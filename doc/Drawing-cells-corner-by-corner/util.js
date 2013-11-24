function forEach(a, f) {
    for (var i = 0; i < a.length; i++) {
        f(a[i], i);
    }
}

function toHexDigit(x) {
    return String.fromCharCode(x + ((x < 10) ? 48 : 55));
}


Object.create = Object.create || (function () {
    function F () {}
    return function (protoObject) {
        if (arguments.length > 1) {
            throw new Error("Object.create with 2nd arg not supported");
        }
        F.prototype = protoObject;
        var out =  new F();
        return out;
    };
}());


function inherit(subConstructor, superConstructor, protoTemplate) {
    subConstructor.prototype = Object.create(superConstructor.prototype);
    subConstructor.prototype.constructor = subConstructor;
    for (var k in protoTemplate) {
        if (protoTemplate.hasOwnProperty(k)) {
            subConstructor.prototype[k] = protoTemplate[k];
        }
    }
}


function EventEmitter() {
    var self = this;
    this.events = {};
    forEach(arguments, function (evtName) {
        self.events[evtName] = [];
    });
}

EventEmitter.prototype = {
    on: function (evtName, cb) {
        this.events[evtName].push(cb);
    },
    emit: function (evtName) {
        //console.log(this.x + ', ' + this.y + ': ' + this.toString());   // <<<<<<<<<<<<<<<<<<<<<<<<<<<< debug
        var args = Array.prototype.slice.call(arguments, 1);
        forEach(this.events[evtName], function (cb) {
            cb.apply(this, args);
        });
    },
};