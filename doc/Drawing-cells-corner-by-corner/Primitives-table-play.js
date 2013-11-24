// requires util.js

function modeRadios()  { return document.querySelectorAll('#play input[type=radio][name=mode]'); }
function dirChecks()   { return document.querySelectorAll('#play input[type=checkbox].dir'); }
function classRadios() { return document.querySelectorAll('#play input[type=radio][name=class]'); }
function primitives(corner, s) {
    return document.querySelectorAll('td' + (corner ? '.' + corner : '') + ' img[regexp]' + (s || ''));
}

var connections = (function () {
    var ctor = function () {
        var self = this;
        EventEmitter.call(this, 'change', 'dirChange', 'modeChange', 'classChange');
        this.on('dirChange', function () { self.emit('change'); });
        this.on('modeChange', function () { self.emit('change'); });
        this.on('classChange', function () { self.emit('change'); });
    };
    inherit(ctor, EventEmitter, {   T: 0, L: 0, B: 0, R: 0,
        mode: undefined, // S or Jv or Jh
        clazz: undefined, // -, 0, 1, 2, 3 or 4
        set: function (dir, connected) {
            dir = directions[dir];
            this[dir] = connected ? dir.bitMask : 0;
            this.emit('dirChange', dir, connected);
        },
        setMode: function (mode) {
            this.mode = mode;
            this.emit('modeChange', mode);
        },
        setClazz: function (clazz) {
            this.clazz = clazz;
            this.emit('classChange', clazz);
        },
        value: function () {
            var out;
            switch (this.mode) {
                case 'S':
                    out = this.T + this.L + this.B + this.R;
                    out = 'm' + toHexDigit(out);
                    break;
                case 'Jh':
                    out = 'npn' + (this.T ? 'T' : '') + (this.B ? 'B' : '')
                    break;
                case 'Jv':
                    out = 'npn' + (this.L ? 'L' : '') + (this.R ? 'R' : '')
                    break;
                default:
                    alert('unknown mode "' + this.mode + '"');
                    throw new TypeError('unknown mode "' + this.mode + '"');
            }
            return out;
        },
        match: function (primitive) {
            var regexp = new RegExp('^' + primitive.getAttribute('regexp') + '$');
            var code = this.value();
            return (code.length > 0) && regexp.test(code);
        },
    });
    return new ctor();
}());

function updatePrimitives() {
    forEach(primitives(), function (p) {
        var parentStyle = p.parentNode.style;
        parentStyle.border = connections.match(p) ? '2px solid red' : '2px solid white';
        parentStyle.backgroundColor = (p.getAttribute('class') || '').indexOf(connections.mode + '-' + connections.clazz) >= 0 ? 'yellow' : 'white';
    });
}

function initPlay() {
    connections.on('change', updatePrimitives);

    forEach(dirChecks(), function (c) {
        c.onclick = function () {
            connections.set(c.getAttribute('name'), c.checked);
        };
    });

    forEach(modeRadios(), function (r) {
        r.onclick = function () {
            var mode = r.value;
            connections.setMode(mode);
            forEach(dirChecks(), function (c) {
                c[c.hasAttribute(mode) ? "removeAttribute" : "setAttribute"]('disabled', '');
            });
            forEach(classRadios(), function (c) {
                c[c.hasAttribute(mode) ? "removeAttribute" : "setAttribute"]('disabled', '');
            });
        };
        if (r.checked) {
            r.onclick();
        }
    });

    forEach(classRadios(), function (c) {
        c.onclick = function () {
            connections.setClazz(c.value);
        };
        if (c.checked) {
            c.onclick();
        }
    });
}
