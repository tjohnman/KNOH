// requires util.js

var corners = ['BR', 'BL', 'TL', 'TR']; // do NOT change order!
var directions = ['R', 'B', 'L', 'T']; // do NOT change order!
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

forEach(corners, function (cName, i) {
    var d0 = directions[cName.substr(0,1)];
    var d1 = directions[cName.substr(1,1)];
    corners[cName] = corners[i] = {
        directions: [d0, d1],
        getPrimitiveIndex: function (bits) {
            bits = ((bits >> i) | (bits << (4 - i))) & 0xF;
            return (bits === 0xC) ? 0 : (bits & 3) + 1;
        },
        toString: function () {
            return cName;
        },
        opposite: function () {
            return corners[this.directions[0].opposite + this.directions[1].opposite];
        },
    };
});

function Cell(container, x, y) {
    var self = this;
    this.x = x;
    this.y = y;
    this.container = container;
    this.silicon = { connections: 0, type: null };
    this.via = { type: false };
    this.metal = { type: false };

    this.div = document.createElement('div');
    this.div.setAttribute('x', x);
    this.div.setAttribute('y', y);
    this.div.setAttribute('title', this.toString());
    container.div.appendChild(this.div);

    this.cellBg = new Image();
    this.cellBg.setAttribute('layer', 'background');
    this.cellBg.setAttribute('class', 'TL');
    this.cellBg.src = 'gfx/cell-background.png?raw=true';
    this.div.appendChild(this.cellBg);

    forEach(corners, function (corner) {
        var img = self.silicon[corner] = new Image();
        img.setAttribute('layer', 'silicon');
        img.setAttribute('class', corner.toString());
        img.src = 'gfx/1x1-transparent.png?raw=true';
        self.div.appendChild(img);
    });
}
Cell.prototype = {
    getNeighbour: function (direction) {
        direction = directions[direction];
        return this.container.get(this.x + direction.dx, this.y + direction.dy);
    },
    hasNeighbour: function (direction) {
        return !!this.getNeighbour(direction);
    },
    isJunction: function () {
        return (this.silicon.type === 'npn') || (this.silicon.type === 'pnp');
    },
    getSiliconType: function () {
        return this.isJunction() ? this.silicon.type.substr(1,1) : this.silicon.type;
    },
    hasSilicon: function () {
        return !!this.getSiliconType();
    },
    hasComplementarySilicon: function (otherCell) {
        return this.hasSilicon() && otherCell.getSiliconType() === (this.getSiliconType() === 'n' ? 'p' : 'n');
    },
    isVerticalJunction: function () {
        var t = this.getNeighbour('T');
        var b = this.getNeighbour('B');
        return this.isJunction()
            && t && this.isConnected('silicon', 'T') && this.hasComplementarySilicon(t)
            && b && this.isConnected('silicon', 'B') && this.hasComplementarySilicon(b)
            // TODO: check L *or* R
        ;
    },
    isHorizontalJunction: function () {
        var l = this.getNeighbour('L');
        var r = this.getNeighbour('R');
        return this.isJunction()
            && l && this.isConnected('silicon', 'L') && this.hasComplementarySilicon(l)
            && r && this.isConnected('silicon', 'R') && this.hasComplementarySilicon(r)
            // TODO: check T *or* B
        ;
    },
    get: function (layer) {
        return this[layer].type;
    },
    set: function (layer, type) {
        var self = this, oLayer = this[layer];
        if (type) {
            forEach(corners, function (corner) {
                var clazz, img = oLayer[corner];
                if ((layer === 'silicon') && (self.isJunction())) {
                    clazz = 'J';
                    if (self.isHorizontalJunction()) {
                        clazz += 'h-' + (self.isConnected('silicon', 'B') ? '1' : '0');
                    } else {
                        clazz += 'v-' + (self.isConnected('silicon', 'R') ? '1' : '0');
                    }
                } else {
                    clazz = 'S-' + corner.getPrimitiveIndex(oLayer.connections);
                }
                var p = primitives(corner, '.' + clazz)[0];
                if (!p) {
                    alert(corner + ': ' + clazz);
                } else {
                    img.src = p.src;
                }
            });
        } else { // clear
            forEach(directions, function (direction) {
                self.disconnect(layer, direction);
            });
            forEach(corners, function (corner) {
                var img = oLayer[corner];
                img.src = 'gfx/1x1-transparent.png?raw=true';
            });
        }
        oLayer.type = type;
        this.div.setAttribute('title', this.toString());
        return this;
    },
    getConnections: function (layer) {
        return this[layer].connections;
    },
    isConnected: function (layer, direction) {
        direction = directions[direction];
        return !!(this[layer].connections & direction.bitMask);
    },
    connect: function (layer, direction) {
        direction = directions[direction];
        if (!this.isConnected(layer, direction)) {
            this[layer].connections |= direction.bitMask;
            this.set(layer, this.get(layer));
            this.getNeighbour(direction).connect(layer, direction.opposite);
        }
        return this;
    },
    disconnect: function (layer, direction) {
        direction = directions[direction];
        if (this.isConnected(layer, direction)) {
            this[layer].connections &= ~direction.bitMask;
            this.set(layer, this.get(layer));
            this.getNeighbour(direction).disconnect(layer, direction.opposite);
        }
        return this;
    },
    toString: function () {
        var out = this.metal.type ? 'm' + toHexDigit(this.metal.connections) : '_';
        if (!this.silicon.type) {
            out += '_';
        } else {
            out += this.silicon.type;
            if (!this.isJunction()) { // non-junction
                out += toHexDigit(this.silicon.connections);
            } else { //junction
                if (this.isHorizontalJunction()) {
                    out += this.isConnected('silicon', 'T') ? 'T' : '';
                    out += this.isConnected('silicon', 'B') ? 'B' : '';
                } else {
                    out += this.isConnected('silicon', 'L') ? 'L' : '';
                    out += this.isConnected('silicon', 'R') ? 'R' : '';
                }
            }
        }
        return out + ' (' + this.getSiliconType() + ' / ' +  toHexDigit(this.silicon.connections) + ')';
    }
};

function initPreview() {
    var x, y, cells = {
        width: 3,
        height: 3,
        get: function (x, y) {
            var c = this[x];
            return c && c[y] || null;
        },
    };
    cells.div = document.createElement('div');
    cells.div.setAttribute('id', 'preview');
    for (x = 0; x < cells.width; x++) {
        cells[x] = [];
        for (y = 0; y < cells.height; y++) {
            cells[x][y] = new Cell(cells, x, y);
        }
    }
    document.querySelector('body').appendChild(cells.div);
    return cells;
}
