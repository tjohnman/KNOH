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
