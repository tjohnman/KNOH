// requires util.js
// requires Primitives-table-play.js

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

function CellView(cell) {
    var self = this;
    cell.on('change', function () {
        self.update();
    });
    this.cell = cell;
}
CellView.prototype = {
    update: function () { throw new Error("NYI"); },
    getHtmlElement: function () { throw new Error("NYI"); },
};

function ImgCellView(cell) {
    var self = this;
    CellView.call(this, cell);

    this.div = document.createElement('div');
    this.div.setAttribute('x', cell.x);
    this.div.setAttribute('y', cell.y);
    this.div.setAttribute('title', this.cell.toString());

    this.initLayer('background', ['TL'], 'gfx/cell-background.png?raw=true');
    this.initLayer('silicon', corners);
    this.initLayer('via', ['TL']);
    this.initLayer('metal', corners);

    this.clearLayer('background');
    this.update();
}
ImgCellView.prototype = Object.create(CellView.prototype);
ImgCellView.prototype.initCorner = function (layer, corner) {
    var img = new Image();
    img.setAttribute('layer', layer);
    img.setAttribute('class', corner.toString());
    this.div.appendChild(img);
    this[layer][corner] = img;
    this[layer].cornerImages.push(img);
};
ImgCellView.prototype.clearLayer = function (layer) {
    var defaultImg = this[layer].defaultImg;
    forEach(this[layer].cornerImages, function (img) {
        img.src = defaultImg;
    });
},
ImgCellView.prototype.initLayer = function (layer, corners, defaultImg) {
    var self = this;
    self[layer] = {
        corners: corners,
        cornerImages: [],
        defaultImg: defaultImg || 'gfx/1x1-transparent.png?raw=true',
    };
    forEach(corners, function (corner) {
        self.initCorner(layer, corner, defaultImg);
    });
};
ImgCellView.prototype.getHtmlElement = function () {
    return this.div;
};
ImgCellView.prototype.update = function () {
    var self = this;
    var s = this.cell.getSiliconType();

    if (this.cell.hasVia()) {
        this.via.TL.src = 'gfx/via.png?raw=true';
    } else {
        this.clearLayer('via');
    }

    if (s) {
        forEach(this.silicon.corners, function (corner) {
            var clazz, img = self.silicon[corner];
            if (self.cell.isJunction()) {
                clazz = 'J';
                if (self.cell.isHorizontalJunction()) {
                    clazz += 'h-' + (self.cell.isConnected('silicon', 'B') ? '1' : '0');
                } else {
                    clazz += 'v-' + (self.cell.isConnected('silicon', 'R') ? '1' : '0');
                }
            } else {
                clazz = 'S-' + corner.getPrimitiveIndex(self.cell.getConnections('silicon'));
            }
            var p = primitives(corner, '.' + clazz)[0];
            if (!p) {
                alert(corner + ': ' + clazz);
            } else {
                img.src = p.src;
            }
        });
    } else {
        this.clearLayer('silicon');
    }

    if (this.cell.hasMetal()) {

    } else {
        this.clearLayer('metal');
    }

    this.div.setAttribute('title', this.cell.toString());
};


function Cell(container, x, y) {
    var self = this;
    this.x = x;
    this.y = y;
    this.container = container;
    this.silicon = { connections: 0, type: null };
    this.via = { type: false };
    this.metal = { connections: 0, type: false };

    this.events = {
        change: [],
    };
}
Cell.prototype = {
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
    getNeighbour: function (direction) {
        direction = directions[direction];
        return this.container.get(this.x + direction.dx, this.y + direction.dy);
    },
    hasNeighbour: function (direction) {
        return !!this.getNeighbour(direction);
    },
    hasVia: function () {
        return !!this.via.type;
    },
    hasMetal: function () {
        return !!this.metal.type;
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
        if (!type) { // clear
            forEach(directions, function (direction) {
                self.disconnect(layer, direction);
            });
        }
        oLayer.type = type;
        this.emit('change');
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
            this.emit('change');
            this.getNeighbour(direction).connect(layer, direction.opposite);
        }
        return this;
    },
    disconnect: function (layer, direction) {
        direction = directions[direction];
        if (this.isConnected(layer, direction)) {
            this[layer].connections &= ~direction.bitMask;
            this.emit('change');
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
    var x, y, c, v, cells = {
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
            c = new Cell(cells, x, y);
            cells[x][y] = c;
            cells.div.appendChild(new ImgCellView(c).getHtmlElement());
        }
    }
    document.querySelector('body').appendChild(cells.div);
    return cells;
}
