####Drawing cells corner-by-corner
Author: **[meisl](https://github.com/meisl)**

Last revision: **November 12, 2013**

Ref: <a href="Whats-in-a-cell.md">Whats-in-a-cell.md</a>
<br> https://github.com/tjohnman/KNOH/issues/3#issuecomment-28255654


--
This text is about creating a **graphical representation** of the so-called **design area**,
ie. where the user can place metal and/or silicon on cells and make connections and vias.
The process of creating such a representation can consist of several stages, 
*not all of which need to happen at runtime* (!).

It is, however, advisable to have each one of these stages easily repeatable and modifiable.
In the following we'll describe a rather early stage, one that'll probably *not* happen at runtime,
but rather be a part of the build process.


--
#####Cells, inter-cell space and round corners
The design area looks like an orthogonal grid of cells which are separated by a small inter-cell space.
This space needs to be drawn differently, depending on connections to neighbouring cells (metal and/or silicon).

Then there is a detail that is not only nice-looking but also makes clearer where connections are
when there are connections in both, the metal and silicon layer.

<img alt="round-corner-diff.png" src="gfx/round-corner-diff.png?raw=true" align="middle">
Focus on the center cell in each of the pictures and try to spot the difference!

The detail is this: if - and only if - a cell is connected to, say, the top and left but not to bottom and right, 
then the bottom right corner of the cell looks a bit more round.
This is one of 4 cases, it holds for any combination of two orthogonal directions (with their opposites, resp.).

In order to address both of these points it is advantageous to *not* distinguish between cell space and
inter-cell space.
Rather we will treat the inter-cell space that is to the **right or bottom** of a cell as **belonging to
the cell itself** (by convention, any pair of orthogonal directions could be used).

<img src="gfx/cell-background.png?raw=true" title="cell-background" align="middle">
Cell-background: 1-pixel inter-cell space in dark gray


--
#####Layers and vias
Due to the fact that there can be metal on top of silicon (or on top of nothing, for that matter),
the metal needs to appear transparent in a way.
This gives rise to quite a number of shades and we don't want to enumerate them all.
So we take a **layered approach**, building up from the bottom (background, incl. inter-cell spacers)
through the middle (silicon) to the top (metal).


Then there's **vias** which can be viewed as belonging to the silicon layer.
That's because there can be a via if there is silicon but no metal
while there cannot be a via if there is metal but no silicon.
However, treating them this way would double the nr of drawing primitives.
We can as well view them as existing in an intermediate layer between the silicon and the metal.
This would indeed allow for vias if there's metal but no silicon - we just don't make use of
this possibility (see below for a similar reasoning).
Hence, putting vias in an intermediate layer makes for one more drawing primitive.

<img src="gfx/via.png?raw=true" title="via" align="middle">
This is how a via looks like


--
#####Junctions
[TODO: explain junctions, ref to "What's in a cell"]
**base**, **horizontal vs vertical**, **implied connections**, **complementary**

<img src="gfx/npnT.png?raw=true" title="horizontal npn junction with (P) base connected to the top" align="middle">
"npnT": horizontal npn junction with (P) base connected to the top

<img src="gfx/pnpLR.png?raw=true" title="vertical pnp junction with (N) base connected to both, left and right" align="middle">
"pnpLR": vertical pnp junction with (N) base connected to both, left and right


--
#####Quadrants
Here's another trick to further systematize things:
a single **cell is split into 4 quadrants** (conceptually, not visually), 
each of which can take on one of a number of different shapes.
We'll call these shapes **"drawing primitive"** and their number depends on the quadrant:
7, 8, 9, 8 (TL, BL, BR, TR).

Not all 7 &times; 8 &times; 9 &times; 8 = 4032 possible combinations of these actually make sense.
In fact it's only 16 + 6 = 22 of them, but that's ok.

A subset of 5 in each quadrant is used exclusively for non-junctions (metal or silicon)
while the rest (2, 3, 4 or 3, resp.) is used exclusively for junctions.
These again each divide into two subsets, one exclusively for vertical and the other exclusively
for horizontal junctions.

We're trading an increase of 4 + 6 in the nr of drawing primitives for reduced complexity of the primitives
and also reduced size of each primitive.
But not only this, even more important is that we can treat things in a *uniform manner*, ie. we're reducing
the number of special cases.

Note that the story would be rather different if we were to design a format for storage and - that's the point -
later retrieval. In that case "can't go wrong *by construction*"
(very much correlated to avoiding redundancy)
has quite high a priority - whereas here it has practically none.

By the way, the increase of 4 in the number of non-junction primitives is entirely due to the "round corner detail".


--
#####Taking it all together
* treating inter-cell space as cell space
* drawing layers on top of each other (be it 3 or 4, doesn't matter too much)
* viewing each cell as being made of quadrants

we gain the following:
* not only can each cell be drawn separately (ie. possibly in parallel) but so could each quadrant
* the drawing primitives are much simpler while their number is still relatively small (~40, depending on how you count, or ~80 if vias are not a separate layer)
* a systematic and uniform way of using them


--
#####Legend
In the illustrations of drawing primitives below we use **five colors**:
* black means the cell border; will be actual black with 100% opacity
* white means 100% transparent, ie. nothing drawn there
* light gray means the layer color, ie. eg yellow for P-silicon, red for N-silicon and 50% white for metal
* dark gray (junctions only): somewhat shaded color of the cell's silicon (which is what the base is made of),
eg. darker red for N, darker yellow for P
* green (junctions only): this stands for the color of the *complementary* silicon wrt. the cell's (base) silicon.
So, for example: if the base is N (ie. a pnp junction) and red is used for N, then green would mean yellow (assuming that's what we use for P)

Then the illustrations have **labels**. 
They indicate the cell connections using the same convention as in <a href="../Whats-in-a-cell.md">"What's in a Kohctpryktop cell?"</a>,
ie. TLBR read MSB-to-LSB.
Each label consists of two parts which are essentially equivalent;
* 1st is in binary
  * X standing for "any" (0 or 1) 
  * _ (underscore) meaning "implied" (for junctions)
  * two digits *scratched*: this is sort of a negation, meaning "any combination *except* the one shown"
* 2nd is the regular expression (part) matching the connections code (part), as by our convention

[TODO: example labels]


--
#####Table of drawing primitives
See <a href="Primitives-table.htm">Primitives-table.htm</a> for an interactive version.
<img src="gfx/Primitives-table.png?raw=true" title="Table of drawing primitives">
