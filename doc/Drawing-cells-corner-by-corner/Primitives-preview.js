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
    this.div = document.createElement('div');
    this.div.setAttribute('x', x);
    this.div.setAttribute('y', y);
    container.div.appendChild(this.div);

    this.cellBg = new Image();
    this.cellBg.setAttribute('layer', 'background');
    this.cellBg.setAttribute('class', 'TL');
    this.cellBg.src = 'gfx/cell-background.png?raw=true';
    this.div.appendChild(this.cellBg);

    this.silicon = { connections: 0, type: null };
    forEach(corners, function (corner) {
        var img = self.silicon[corner] = new Image();
        img.setAttribute('layer', 'silicon');
        img.setAttribute('class', corner.toString());
        img.src = 'gfx/1x1-transparent.png?raw=true';
        self.div.appendChild(img);
    });
}
Cell.prototype = {
    get: function (layer) {
        return this[layer].type;
    },
    set: function (layer, type) {
        var self = this, oLayer = this[layer];
        if (type) {
            forEach(corners, function (corner) {
                var img = oLayer[corner];
                img.src = primitives(corner, '[class="S-' + corner.getPrimitiveIndex(oLayer.connections) + '"]')[0].src;
            });
        } else { // clear
            forEach(directions, function (direction) {
                self.disconnect(layer, direction);
            });
            forEach(corners, function (corner) {
                oLayer[corner].src = 'gfx/1x1-transparent.png?raw=true';
            });
        }
        oLayer.type = type;
        return this;
    },
    getConnections: function (layer) {
        return this[layer].connections;
    },
    getNeighbour: function (direction) {
        direction = directions[direction];
        return this.container[this.x + direction.dx][this.y + direction.dy];
    },
    isConnected: function (layer, direction) {
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
};

function initPreview() {
    var x, y, cells = [];
    cells.div = document.createElement('div');
    cells.div.setAttribute('id', 'preview');
    for (x = 0; x < 3; x++) {
        cells[x] = [];
        for (y = 0; y < 3; y++) {
            cells[x][y] = new Cell(cells, x, y);
        }
    }
    document.querySelector('body').appendChild(cells.div);
    return cells;
}
