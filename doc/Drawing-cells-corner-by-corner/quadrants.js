// requires util.js

var quadrants = ['BR', 'BL', 'TL', 'TR']; // do NOT change order!
var directions = ['R', 'B', 'L', 'T']; // do NOT change order!

// init
(function init() {
    var dirVectors = {
        'T': { dx:  0, dy: -1, opposite: 'B', bitMask: 1 << 3 },
        'L': { dx: -1, dy:  0, opposite: 'R', bitMask: 1 << 2 },
        'B': { dx:  0, dy: +1, opposite: 'T', bitMask: 1 << 1 },
        'R': { dx: +1, dy:  0, opposite: 'L', bitMask: 1 << 0 },
    };

    forEach(directions, function (dName, i) {
        var oDir = directions[dName] = directions[i] = dirVectors[dName];
        oDir.toString = function () {
            return dName;
        };
        oDir.opposite = dirVectors[oDir.opposite];
    });

    forEach(quadrants, function (qName, i) {
        var d0 = directions[qName.substr(0,1)];
        var d1 = directions[qName.substr(1,1)];
        quadrants[qName] = quadrants[i] = {
            directions: [d0, d1],
            getPrimitiveIndex: function (bits) {
                bits = ((bits >> i) | (bits << (4 - i))) & 0xF;
                return (bits === 0xC) ? 0 : (bits & 3) + 1;
            },
            toString: function () {
                return qName;
            },
            opposite: function () {
                return quadrants[this.directions[0].opposite + this.directions[1].opposite];
            },
        };
    });
}());