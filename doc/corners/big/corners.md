####Drawing cells corner-by-corner
Author: **[meisl](https://github.com/meisl)**

Last revision: **November 12, 2013**

Ref: https://github.com/tjohnman/KNOH/issues/3#issuecomment-28255654

--
#####Note: junctions (in the silicon layer) are completely ignored. That's a TODO.
--


#####Cells, inter-cell space and round corners
The design area looks like an orthogonal grid of cells which are separated by a small inter-cell space.
This space needs to be drawn differently, depending on connections to neighbouring cells (metal and/or silicon).

Then there is a detail that is not only nice-looking but also makes clearer where connections are
when there are connections in both, the metal and silicon layer.
Focus on the center cell in each of the following pictures and try to spot the difference:

<img alt="round-corner-diff.png" src="round-corner-diff.png?raw=true">

The detail is this: if - and only if - a cell is connected to, say, the top and left but not to bottom and right, 
then the bottom right corner of the cell looks a bit more round.
This is one of 4 cases, it holds for any combination of two orthogonal directions (with their opposites, resp.).


In order to address both of these points it is advantageous to *not* distinguish between cell space and
inter-cell space.
Rather we will treat the inter-cell space that is to the **right and bottom** of a cell as **belonging to
the cell itself** (by convention, any pair of orthogonal directions could be used).


#####Layers and vias
Due to the fact that there can be metal on top of silicon (or on top of nothing, for that matter),
the metal needs to appear transparent in a way.
This gives rise to quite a number of shades and we don't want to enumerate them all.
So we take a layered approach, building up from the bottom (background, incl. inter-cell spacers)
through the middle (silicon) to the top (metal).

<img src="cell-background.png?raw=true" title="cell-background">

Then there's **vias** which can be viewed as belonging to the silicon layer.
That's because there can be a via if there is silicon but no metal
while there cannot if there is metal but no silicon.
However, treating them this way would double the nr of drawing primitives.
We can as well view them as existing in an intermediate layer between the silicon and the metal.
This would indeed allow for vias if there's metal but no silicon - we just don't make use of
this possibility (see below for a similar reasoning).
Hence, putting vias in an intermediate layer makes for one more drawing primitive.

<img src="via.png?raw=true" title="via">


#####Quadrants
Here's another trick to further systematize things:
a single **cell is split into 4 quadrants** (conceptuall, not visually), 
each of which can take on one of 5 different shapes.

Not all 5 ^ 4 = 625 possible combinations of these actually make sense.
In fact it's only 16 of them, but that's ok.
We're trading an increase of 4 in the nr of drawing primitives for reduced complexity of the primitives
and also reduced size of each primitive.

Note that the story would be rather different if we were to design a format for storage and - that's the point -
later retrieval. In that case "can't go wrong *by construction*"
(very much correlated to avoiding redundancy)
has quite high a priority - whereas here it has practically none.

By the way, the increase of 4 is entirely due to the "round corner detail".


#####Taking it all together
* treating inter-cell space as cell space
* drawing layers on top each other (be it 2 or 3, doesn't matter too much)
* viewing each cell as being made of quadrants

we gain the following:
* not only can each cell be drawn separately (ie. possibly in parallel) but so could each quadrant
* the drawing primitives are much simpler while their number is still relatively small (21 or 40, resp.)


#####Legend
In the drawing primitive illustrations below three colors are used:
* black means the cell border; will be actual black with 100% opacity
* white means 100% transparent, ie. nothing
* gray means the layer color, ie. eg yellow for P-silicon, red for N-silicon and 50% white for metal
...and the illustrations are labelled with a code that represents the cell connections using the same
convention as in <a href="../../../Save File Specifications.md">"Save File Specifications.md"</a>,
ie. TLBR read MSB-to-LSB. The first part of a label is in binary, X standing for "don't care".
The second part is equivalent but in the form of a regular expression, as alternatives of hex digits.


<img src="primitives-table.png?raw=true" title="Table of drawing primitives">
