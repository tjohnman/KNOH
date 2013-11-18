<!DOCTYPE HTML>
<html>
 <head>
    <title>Primitives table / corner-by-corner</title>
    <meta name="Generator" content="EditPlus">
    <meta name="Author" content="meisl">
    <link rel="stylesheet" type="text/css" href="Primitives-table.css">
    <link rel="stylesheet" type="text/css" href="Primitives-table-play.css">
    <link rel="stylesheet" type="text/css" href="Primitives-preview.css">
    
    <script type="text/javascript">
    <!--
        window.onload = function () {
            initPlay();

            var cells = initPreview();
            cells[1][0].set('silicon', 'n');
            cells[0][1].set('silicon', 'n');
            cells[1][1].set('silicon', 'n');
            cells[2][1].set('silicon', 'n');
            cells[1][2].set('silicon', 'n');

            cells[1][1].connect('silicon', 'T');
            cells[1][1].connect('silicon', 'L');
            cells[1][1].connect('silicon', 'B');
            cells[1][1].connect('silicon', 'R');
            cells[1][1].disconnect('silicon', 'L');
            cells[1][1].disconnect('silicon', 'B');
        };
    //-->
    </script>
 </head>

 <body>

    <table>
    <tr>
        <td class="TL"><table>
            <tr>
                <td class="quadrant-label" rowspan="3"><div id="TL"></div></td>
                <td>
                    <img class="S-0" regexp="[mnp][3]" src="gfx/TL-0011.png?raw=true" title="connected to the right and bottom but NOT to top and left">
                    0011 [3]
                </td>
                <td class="junction" colspan="2">
                    <img class="Jh-0 Jh-1" regexp="(npn|pnp)(TB?|B)" src="gfx/TL-T-or-B-or-TB.png?raw=true" title="junction: base connected to the top or bottom or both (left and right implicit)">
                    <strike>0</strike>_<strike>0</strike>_ (TB?|B)
                </td>
            </tr>
            <tr>
                <td class="junction" rowspan="2">
                    <img class="Jv-0 Jv-1" regexp="(npn|pnp)(LR?|R)" src="gfx/TL-L-or-R-or-LR.png?raw=true" title="junction: base connected to the left or right or both (top and bottom implicit)">
                    _<strike>0</strike>_<strike>0</strike> (LR?|R)
                </td>
                <td>
                    <img class="S-1" regexp="[mnp][012]" src="gfx/TL-0000-or-0001-or-0010.png?raw=true" title="NOT connected to the left and NOT to the top and NOT to *both*, right and bottom">
                    00<strike>11</strike> [012]
                </td>
                <td>
                    <img class="S-2" regexp="[mnp][4567]" src="gfx/TL-01XX.png?raw=true" title="connected to the left but NOT to the top">
                    01XX [4567]
                </td>
            </tr>
            <tr>
                <td>
                    <img class="S-3" regexp="[mnp][89AB]" src="gfx/TL-10XX.png?raw=true" title="connected to the top but NOT to the left">
                    10XX [89AB]
                </td>
                <td>
                    <img class="S-4" regexp="[mnp][CDEF]" src="gfx/TL-11XX.png?raw=true" title="connected to the top and left">
                    11XX [CDEF]
                  </td>
            </tr>
        </table></td>

        <td class="TR"><table>
            <tr>
                <td class="junction" colspan="2">
                    <img class="Jh-0 Jh-1" regexp="(npn|pnp)(TB?|B)" src="gfx/TR-T-or-B-or-TB.png?raw=true" title="junction: base connected to the top or bottom or both (left and right implicit)">
                    <strike>0</strike>_<strike>0</strike>_ (TB?|B)
                </td>
                <td>
                    <img class="S-0" regexp="[mnp][6]" src="gfx/TR-0110.png?raw=true" title="connected to the left and bottom but NOT to top and right">
                    0110 [6]
                </td>
                <td class="quadrant-label" rowspan="3"><div id="TR"></div></td>
            </tr>
            <tr>
                <td>
                    <img class="S-3" regexp="[mnp][1357]" src="gfx/TR-0XX1.png?raw=true" title="connected to the right but NOT to the top">
                    0XX1 [1357]
                </td>
                <td>
                    <img class="S-1" regexp="[mnp][024]" src="gfx/TR-0000-or-0010-or-0100.png?raw=true" title="NOT connected to the top and NOT to the right and NOT to *both*, left and bottom">
                    0<strike>11</strike>0 [024]
                </td>
                <td class="junction">
                    <img class="Jv-0" regexp="(npn|pnp)(L)" src="gfx/TR-L.png?raw=true" title="junction: base connected to the left but NOT to the right (top and bottom implicit)">
                    _1_0 (L)
                </td>
            </tr>
            <tr>
                <td>
                    <img class="S-4" regexp="[mnp][9BDF]" src="gfx/TR-1XX1.png?raw=true" title="connected to the top and right">
                    1XX1 [9BDF]
                </td>
                <td>
                    <img class="S-2" regexp="[mnp][8ACE]" src="gfx/TR-1XX0.png?raw=true" title="connected to the top but NOT to the right">
                    1XX0 [8ACE]
                </td>
                <td class="junction">
                    <img class="Jv-1" regexp="(npn|pnp)(L?R)" src="gfx/TR-R-or-LR.png?raw=true" title="junction: base connected to the right and maybe to the left (top and bottom implicit)">
                    _X_1 (L?R)
                </td>
            </tr>
        </table></td>
    </tr>


    <tr>
        <td class="BL"><table>
            <tr>
                <td class="quadrant-label" rowspan="3"><div id="BL"></div></td>
                <td class="junction" rowspan="2">
                    <img class="Jv-0 Jv-1" regexp="(npn|pnp)(LR?|R)" src="gfx/BL-L-or-R-or-LR.png?raw=true" title="junction: base connected to the left or right or both (top and bottom implicit)">
                    _<strike>0</strike>_<strike>0</strike> (LR?|R)
                </td>
                <td>
                    <img class="S-2" regexp="[mnp][23AB]" src="gfx/BL-X01X.png?raw=true" title="connected to the bottom but NOT to the left">
                    X01X [23AB]
                </td>
                <td>
                    <img class="S-4" regexp="[mnp][67EF]" src="gfx/BL-X11X.png?raw=true" title="connected to the left and bottom">
                    X11X [67EF]
                </td>
            </tr>
            <tr>
                <td>
                    <img class="S-1" regexp="[mnp][018]" src="gfx/BL-0000-or-0001-or-1000.png?raw=true" title="NOT connected to the left and NOT to the bottom and NOT to *both*, right and top">
                    <strike>1</strike>00<strike>1</strike> [018]
                </td>
                <td>
                    <img class="S-3" regexp="[mnp][45CD]" src="gfx/BL-X10X.png?raw=true" title="connected to the left but NOT to the bottom">
                    X10X [45CD]
                </td>
            </tr>
            <tr>
                <td>
                    <img class="S-0" regexp="[mnp][9]" src="gfx/BL-1001.png?raw=true" title="connected to the top and to the right but NOT to left and bottom">
                    1001 [9]
                </td>
                <td class="junction">
                    <img class="Jh-0" regexp="(npn|pnp)(T)" src="gfx/BL-T.png?raw=true" title="junction: base connected to the top but NOT to the bottom (left and right implicit)">
                    1_0_ (T)
                </td>
                <td class="junction">
                    <img class="Jh-1" regexp="(npn|pnp)(T?B)" src="gfx/BL-B-or-TB.png?raw=true" title="junction: base connected to the bottom and maybe to the top (left and right implicit)">
                    X_1_ (T?B)
                </td>
            </tr>
        </table></td>


        <td class="BR"><table>
            <tr>
                <td>
                    <img class="S-4" regexp="[mnp][37BF]" src="gfx/BR-XX11.png?raw=true" title="connected to the bottom and right">
                    XX11 [37BF]
                </td>
                <td>
                    <img class="S-3" regexp="[mnp][26AE]" src="gfx/BR-XX10.png?raw=true" title="connected to the bottom but NOT to the right">
                    XX10 [26AE]
                </td>
                <td class="junction">
                    <img class="Jv-1" regexp="(npn|pnp)(L?R)" src="gfx/BR-R-or-LR.png?raw=true" title="junction: base connected to the right and maybe to the left (top and bottom implicit)">
                    _X_1 (L?R)
                </td>
                <td class="quadrant-label" rowspan="3"><div id="BR"></div></td>
            </tr>
            <tr>
                <td>
                    <img class="S-2" regexp="[mnp][159D]" src="gfx/BR-XX01.png?raw=true" title="connected to the right but NOT to the bottom">
                    XX01 [159D]
                </td>
                <td>
                    <img class="S-1" regexp="[mnp][048]" src="gfx/BR-0000-or-0100-or-1000.png?raw=true" title="NOT connected to the bottom and NOT to the right and NOT to *both*, top and left">
                    <strike>11</strike>00 [048]
                </td>
                <td class="junction">
                    <img class="Jv-0" regexp="(npn|pnp)(L)" src="gfx/BR-L.png?raw=true" title="junction: base connected to the left but NOT to the right (top and bottom implicit)">
                    _1_0 (L)
                </td>
            </tr>
            <tr>
                <td class="junction">
                    <img class="Jh-1" regexp="(npn|pnp)(T?B)" src="gfx/BR-B-or-TB.png?raw=true" title="junction: base connected to the bottom and maybe to the top (left and right implicit)">
                    X_1_ (T?B)
                </td>
                <td class="junction">
                    <img class="Jh-0" regexp="(npn|pnp)(T)" src="gfx/BR-T.png?raw=true" title="junction: base connected to the top but NOT to the bottom (left and right implicit)">
                    1_0_ (T)
                </td>
                <td>
                    <img class="S-0" regexp="[mnp][C]" src="gfx/BR-1100.png?raw=true" title="connected to the top and left but NOT to bottom and right">
                    1100 [C]
                </td>
            </tr>
        </table></td>

    </tr>
    </table>

    <table id="play" style="position:absolute;left:950px;top:430px;border:1px solid black;">
    <tr>
        <td>
            <table id="mode">
            <tr>
                <td>
                    <input type="radio" name="mode" value="S" checked>Non-junction (S)
                </td>
            </tr>
            <tr>
                <td>
                    <input type="radio" name="mode" value="Jv">Vert. junction (Jv)
                </td>
            </tr>
            <tr>
                <td>
                    <input type="radio" name="mode" value="Jh">Horiz. junction (Jh)
                </td>
            </tr>
            </table>
        </td>
        <td>
            <table id="directions">
            <tr>
                <td></td>
                <td></td>
                <td>T</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td><input class="dir" S Jh type="checkbox" name="T" value="8"></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>L</td>
                <td><input class="dir" S Jv type="checkbox" name="L" value="4"></td>
                <td></td>
                <td><input class="dir" S Jv type="checkbox" name="R" value="1"></td>
                <td>R</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td><input class="dir" S Jh type="checkbox" name="B" value="2"></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td>B</td>
                <td></td>
                <td></td>
            </tr>
            </table>
        </td>
    </tr>
        <td colspan="2">
            <table id="classes">
            <tr>
                <td><input type="radio" name="class" S Jh Jv value="-" checked></td>
                <td><input type="radio" name="class" S Jh Jv value="0"></td>
                <td><input type="radio" name="class" S Jh Jv value="1"></td>
                <td><input type="radio" name="class" S value="2"></td>
                <td><input type="radio" name="class" S value="3"></td>
                <td><input type="radio" name="class" S value="4"></td>
            </tr>
            <tr>
                <td>-</td>
                <td>0</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
            </tr>
            </table>
        </td>
    <tr>
    </tr>
    </table>

    <script type="text/javascript">
    <!--

        function forEach(a, f) {
            for (var i = 0; i < a.length; i++) {
                f(a[i], i);
            }
        }

        function modeRadios()  { return document.querySelectorAll('#play input[type=radio][name=mode]'); }
        function dirChecks()   { return document.querySelectorAll('#play input[type=checkbox].dir'); }
        function classRadios() { return document.querySelectorAll('#play input[type=radio][name=class]'); }
        function primitives(corner, s) {
            return document.querySelectorAll('td' + (corner ? '.' + corner : '') + ' img[regexp]' + (s || ''));
        }

        var connections = { T: 0, L: 0, B: 0, R: 0,
            mode: undefined, // S or Jv or Jh
            clazz: undefined, // -, 0, 1, 2, 3 or 4
            value: function () {
                var out;
                switch (this.mode) {
                    case 'S':
                        out = this.T + this.L + this.B + this.R;
                        out = 'm' + String.fromCharCode(out + ((out < 10) ? 48 : 55));
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
        };

        function updatePrimitives() {
            forEach(primitives(), function (p) {
                var parentStyle = p.parentNode.style;
                parentStyle.border = connections.match(p) ? '2px solid red' : '2px solid white';
                parentStyle.backgroundColor = (p.getAttribute('class') || '').indexOf(connections.mode + '-' + connections.clazz) >= 0 ? 'yellow' : 'white';
            });
        }

        forEach(dirChecks(), function (c) {
            c.onclick = function () {
                connections[c.getAttribute('name')] = c.checked ? parseInt(c.value) : 0;
                updatePrimitives();
            };
        });

        function initPlay() {
            forEach(modeRadios(), function (r) {
                r.onclick = function () {
                    var mode = r.value;
                    connections.mode = mode;
                    forEach(dirChecks(), function (c) {
                        c[c.hasAttribute(mode) ? "removeAttribute" : "setAttribute"]('disabled', '');
                    });
                    forEach(classRadios(), function (c) {
                        c[c.hasAttribute(mode) ? "removeAttribute" : "setAttribute"]('disabled', '');
                    });
                    updatePrimitives();
                };
                if (r.checked) {
                    r.onclick();
                }
            });

            forEach(classRadios(), function (c) {
                c.onclick = function () {
                    connections.clazz = c.value;
                    updatePrimitives();
                };
                if (c.checked) {
                    c.onclick();
                }
            });
        }

        /******************************************************************************************/
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

            this.silicon = { neighbours: {}, connections: 0, type: null };
            forEach(corners, function (corner) {
                var img = self.silicon[corner] = new Image();
                img.setAttribute('layer', 'silicon');
                img.setAttribute('class', corner.toString());
                img.src = 'gfx/noop.png?raw=true';
                self.div.appendChild(img);
            });
            forEach(directions, function (direction) {
                self.silicon.neighbours[direction] = null;
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
                        oLayer[corner].src = 'gfx/noop.png?raw=true';
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
                return !!this[layer].neighbours[direction];
            },
            connect: function (layer, direction) {
                var n;
                direction = directions[direction];
                if (!this.isConnected(layer, direction)) {
                    n = this.getNeighbour(direction);
                    this[layer].neighbours[direction] = n;
                    this[layer].connections |= direction.bitMask;
                    this.set(layer, this.get(layer));
                    n.connect(layer, direction.opposite);
                }
                return this;
            },
            disconnect: function (layer, direction) {
                var n;
                direction = directions[direction];
                if (this.isConnected(layer, direction)) {
                    n = this.getNeighbour(direction);
                    this[layer].neighbours[direction] = null;
                    this[layer].connections &= ~direction.bitMask;
                    this.set(layer, this.get(layer));
                    n.disconnect(layer, direction.opposite);
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
    //-->
    </script>

 </body>
</html>
