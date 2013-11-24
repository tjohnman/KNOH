// requires util.js
// quadrants.js
// requires Primitives-table-play.js

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
    this.initLayer('silicon', quadrants);
    this.initLayer('via', ['TL']);
    this.initLayer('metal', quadrants);

    this.clearLayer('background');
    this.update();
}

inherit(ImgCellView, CellView, {
    initQuadrant: function (layer, q) {
        var img = new Image();
        img.setAttribute('layer', layer);
        img.setAttribute('class', q.toString());
        this.div.appendChild(img);
        this[layer][q] = img;
        this[layer].quadrantImages.push(img);
    },
    clearLayer: function (layer) {
        var defaultImg = this[layer].defaultImg;
        forEach(this[layer].quadrantImages, function (img) {
            img.src = defaultImg;
        });
    },
    initLayer: function (layer, quadrants, defaultImg) {
        var self = this;
        self[layer] = {
            quadrants: quadrants,
            quadrantImages: [],
            defaultImg: defaultImg || 'gfx/1x1-transparent.png?raw=true',
        };
        forEach(quadrants, function (q) {
            self.initQuadrant(layer, q, defaultImg);
        });
    },
    getHtmlElement: function () {
        return this.div;
    },
    update: function () {
        var self = this;
        var s = this.cell.getSiliconType();

        if (this.cell.hasVia()) {
            this.via.TL.src = 'gfx/via.png?raw=true';
        } else {
            this.clearLayer('via');
        }

        if (s) {
            forEach(this.silicon.quadrants, function (q) {
                var clazz, img = self.silicon[q];
                if (self.cell.isJunction()) {
                    clazz = 'J';
                    if (self.cell.isHorizontalJunction()) {
                        clazz += 'h-' + (self.cell.isConnected('silicon', 'B') ? '1' : '0');
                    } else {
                        clazz += 'v-' + (self.cell.isConnected('silicon', 'R') ? '1' : '0');
                    }
                } else {
                    clazz = 'S-' + q.getPrimitiveIndex(self.cell.getConnections('silicon'));
                }
                var p = primitives(q, '.' + clazz)[0];
                if (!p) {
                    alert(q + ': ' + clazz);
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
    },
});


function Cell(container, x, y) {
    EventEmitter.call(this, 'change');
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
inherit(Cell, EventEmitter, {
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
    getSiliconType: function () {
        return this.silicon.type;
    },
    hasSilicon: function () {
        return !!this.getSiliconType();
    },
    hasSameSilicon: function (otherCell) {
        return this.hasSilicon() && otherCell.getSiliconType() === this.getSiliconType();
    },
    hasComplementarySilicon: function (otherCell) {
        return this.hasSilicon() && otherCell.getSiliconType() === (this.getSiliconType() === 'n' ? 'p' : 'n');
    },
    isVerticalJunction: function () {
        var t = this.getNeighbour('T');
        var l = this.getNeighbour('L');
        var b = this.getNeighbour('B');
        var r = this.getNeighbour('R');
        return t && this.isConnected('silicon', 'T') && this.hasComplementarySilicon(t)
            && b && this.isConnected('silicon', 'B') && this.hasComplementarySilicon(b)
            && (l && this.isConnected('silicon', 'L') && this.hasSameSilicon(l)
             || r && this.isConnected('silicon', 'R') && this.hasSameSilicon(r)
            )
        ;
    },
    isHorizontalJunction: function () {
        var t = this.getNeighbour('T');
        var l = this.getNeighbour('L');
        var b = this.getNeighbour('B');
        var r = this.getNeighbour('R');
        return l && this.isConnected('silicon', 'L') && this.hasComplementarySilicon(l)
            && r && this.isConnected('silicon', 'R') && this.hasComplementarySilicon(r)
            && (t && this.isConnected('silicon', 'T') && this.hasSameSilicon(t)
             || b && this.isConnected('silicon', 'B') && this.hasSameSilicon(b)
            )
        ;
    },
    isJunction: function () {
        return this.isVerticalJunction() || this.isHorizontalJunction();
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
    setConnected: function (layer, direction, connected) {
        direction = directions[direction];
        if (this.isConnected(layer, direction) !== !!connected) {
            if (connected) {
                this[layer].connections |= direction.bitMask;
            } else {
                this[layer].connections &= ~direction.bitMask;
            }
            this.emit('change');
            this.getNeighbour(direction).setConnected(layer, direction.opposite, connected);
        }
        return this;
    },
    connect: function (layer, direction) {
        return this.setConnected(layer, direction, true);
    },
    disconnect: function (layer, direction) {
        return this.setConnected(layer, direction, false);
    },
    toString: function () {
        var cs;
        var out = this.metal.type ? 'm' + toHexDigit(this.metal.connections) : '_';
        if (!this.silicon.type) {
            out += '_';
        } else {
            if (!this.isJunction()) { // non-junction
                out += this.silicon.type;
                out += toHexDigit(this.silicon.connections);
            } else { //junction
                if (this.isHorizontalJunction()) {
                    cs = this.getNeighbour('L').getSiliconType(); // must be complementary silicon
                    out += cs + this.silicon.type + cs;
                    out += this.isConnected('silicon', 'T') ? 'T' : '';
                    out += this.isConnected('silicon', 'B') ? 'B' : '';
                } else {
                    cs = this.getNeighbour('T').getSiliconType(); // must be complementary silicon
                    out += cs + this.silicon.type + cs;
                    out += this.isConnected('silicon', 'L') ? 'L' : '';
                    out += this.isConnected('silicon', 'R') ? 'R' : '';
                }
            }
        }
        return out + ' (' + this.getSiliconType() + ' / ' +  toHexDigit(this.silicon.connections) + ')';
    }
});

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

    var top = cells[1][0].set('silicon', 'n');
    var left = cells[0][1].set('silicon', 'n');
    var center = cells[1][1].set('silicon', 'n');
    var right = cells[2][1].set('silicon', 'n');
    var bottom = cells[1][2].set('silicon', 'n');
    var all = [top, left, center, right, bottom];
    var hNeighbours = [left, right];
    var vNeighbours = [top, bottom];

    connections.on('dirChange', function (dir, connected) {
        center.setConnected('silicon', dir, connected);
    });
    connections.on('modeChange', function (mode) {
        switch (mode) {
            case 'S':
                forEach(all, function (c) {
                    c.set('silicon', 'n');
                });
                break;
            case 'Jv':
                forEach(hNeighbours, function (c) {
                    c.set('silicon', 'p');
                });
                forEach(vNeighbours, function (c) {
                    c.set('silicon', 'n');
                });
                center.set('silicon', 'p');
                break;
            case 'Jh':
                forEach(hNeighbours, function (c) {
                    c.set('silicon', 'n');
                });
                forEach(vNeighbours, function (c) {
                    c.set('silicon', 'p');
                });
                center.set('silicon', 'p');
                break;
            default:
        }
    });
    return cells;
}
