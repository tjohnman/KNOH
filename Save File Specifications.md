####Save File Format
Author: **meisl** Last revision: **December 8, 2013**

--

Here's mentioned regexp, with rationale:
```
(_|m[0-9A-F])(_|[np][0-9A-F]v?|((npn|pnp)(TB?|B|LR?|R))
```
*17 &times; 73 = 1241 configurations in total; see below for details.*

Before the explanation let me state that: It
* is meant as a tool for analysis (as eg the # of different cell images, given certain conventions)
* should yield valid and fairly reasonable file names
* should be (somewhat) parseable by a human
* represents a **cell-centric view on things**, ie it's supposed to contain exactly the right amount of information to describe one cell completely; "stand-alone" (as by what can exist in the original game)
* does contain - when used in an encoding of an *array of cells* - redundant information
* is therefore probably NOT how things are encoded in the actual data format (see above, I reckon the actual thing is rather separating a) what's in the cell (m and/or silicon) and b) connections)

--

Now here's the rationale: it decomposes into two main parts:
* metal layer and its connections: ``(_|m[0-9A-F])``
* silicon layer with variations and connections: ``(_|[np][0-9A-F]v?|((npn|pnp)(TB?|B|LR?|R))``

##### Metal layer
Pretty simple: either there is no metal (``_``) or there is (``m``). In the latter case there can exist connections to any of four sides: top, right, bottom, left - which is encoded in 4 bits, represented as one hex digit (``[0-9A-F]``).
Which bit means which direction is up to convention. Doesn't matter much but I think it should be either be clockwise or anti-clockwise, read MSB-to-LSB or LSB-to-MSB.
*The two alternatives yield a total of 1 + 16 = 17 configurations in the metal layer.*

##### Silicon layer
Here we got three alternatives:
* no silicon at all (``_``), hence no connections there ( *1 configuration* )
* simple negative or positive silicon (``[np]``) and if so: connections like in metal layer (``[0-9A-F]``) **plus** maybe a via (``v?``) (*2 &times; 16 &times; 2 = 64 configurations*)
* or a junction - that's the tricky one ( *a total of 8 configurations, detailed below* )

*As by the above, there are a total of 1 + 64 + 8 = 73 configurations in the silicon layer.*

A junction then is further detailed like so:
* ``(npn|pnp)``, obvious ( *&times; 2 wrt nr of configurations* ). But plz note that ``npn`` 1st of all (but not only) implies 2 *normal* **N**-silicon connections while ``pnp`` implies 2 *normal* **P**-silicon connections (ie. the "collector" and "emitter" connections)
* ``(TB?|B|LR?|R)`` ( *&times; 4 wrt nr of configurations* ): this is to encode both, 
  * a) horizontal vs vertical orientation of the ``npn`` or ``pnp`` sequence as a whole
  * b) AND, as a junction implies * **at least one** connection from a neighbouring cell **to the middle part** * (ie the "base" connection) - which of them are present. ``T`` (Top), ``B`` (Bottom), ``L`` (Left) and ``R`` (Right) encode which neighbour relative to the middle part is connected (implying, of course, that same sort of silicon in that neighbour as in the middle part).

Again, should expand on the last point. This time by example:
* ``npnT`` encodes 
  * a **horizontal** junction (thereby implying simple ``n`` on the left and right)
  * plus the **top** neighbour being simple ``p`` and connected to the ``p`` "base".
       But the **bottom neighbour is NOT** connected and can have whatever silicon (incl. none) whatsoever.
* ``pnpLR`` encodes
  * a **vertical** junction (thereby implying simple ``p`` on the top and bottom)
  * plus the **left and right** neighbour being simple ``n`` and connected to the ``n`` "base".
* ``npnR`` encodes 
  * a **vertical** junction (thereby implying simple ``n`` on the top and bottom)
  * plus the **right** neighbour being simple ``p`` and connected to the ``p`` "base".
       But the **left neighbour is NOT** connected and can have whatever silicon (incl. none) whatsoever.
* ``pnpRL`` is illegal
* ... as is ``npnBT``
* ... or ``npnTBv``
* ...

---
