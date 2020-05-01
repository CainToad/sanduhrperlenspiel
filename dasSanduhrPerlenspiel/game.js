// game.js for Perlenspiel 3.2

// The "use strict" directive in the following line is important. Don't alter or remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't alter or remove them!

/*jslint nomen: true, white: true */
/*global PS */

/*
This is a template for creating new Perlenspiel games.
All event-handling functions are commented out by default.
Uncomment and add code to the event handlers required by your project.
*/

function writeString(x, y, to_write) {
    to_write.split("").forEach(function(e, i) {
        PS.glyph(x + i, y, e);
    });
}

function colorBigBead(x, y, color) {
    for(let i = 0, j; i < 2; i++) {
        for (j = 0; j < 2; j++) {
            PS.color(x + j, y + i, (color !== null) ? color : 0xffffff);
        }
    }
}
let borderBigBead = (function() {
    let border_data = [
        [0, 0, {top: 2, left: 2}],
        [1, 0, {top: 2, right: 2}],
        [0, 1, {bottom: 2, left: 2}],
        [1, 1, {bottom: 2, right: 2}]
    ];

    return function(x, y) {
        border_data.forEach(function(e) {
            PS.border(x + e[0], y + e[1], e[2]);
        });
    };
})();

let score_controller = (function(){
    let bead_tree = game_controller.getBeadList(),
        score_set = game_controller.getColors().map((e) => [e, 0]),
        score_ptr = 0,
        controller = Object.create(null),
        cup = {x: null, y: null, left: 34, right: 35, color: null},
        highlights = [],
        curr;

    controller.getScorePtr = function() {
        return score_ptr;
    };
    controller.getScoreData = function() {
        return score_set;
    };
    controller.flush = function(){
        if (score_set[score_ptr][0] === cup.color) {
            score_set[score_ptr][1]++;
        }
        score_ptr = (score_ptr + 1) % score_set.length;
        cup.color = null;
        curr = cup;
        this.setHighlights(curr.left, curr.right);
        this.draw();
    };
    controller.reset = function(){
        game_controller.setBeadColors();
        score_set.forEach(function(e) {
            e[1] = 0;
        });
        score_ptr = 0;
        cup.color = null;
        curr = cup;
        this.setHighlights(curr.left, curr.right);
        this.draw();
    };
    controller.click = function(data) {
        if (highlights.includes(data)) {
            curr.color = data.color;
            data.color = null;
            PS.border(PS.ALL, PS.ALL, 0);
            this.setHighlights(data.left, data.right);
            if (highlights.length < 1) {
                this.flush();
            } else {
                curr = data;
            }
        }
    };
    controller.draw = function() {
        bead_tree.forEach(function(e) {
            colorBigBead(e.x, e.y, e.color);
        });
        PS.glyph(PS.ALL, PS.ALL, "");
        score_set.forEach(function(e, i) {
            PS.color(11, i, e[0]);
            writeString(12, i, e[1] + "");
        });
        PS.glyph(10, score_ptr, ">");
    };

    controller.setHighlights = function(left, right) {
        highlights = [];
        if ((left !== null) && (bead_tree[left].color !== null)) {
            highlights.push(bead_tree[left]);
        }
        if ((right !== null) && (bead_tree[right].color !== null)) {
            highlights.push(bead_tree[right]);
        }
        highlights.forEach(function(e){
            borderBigBead(e.x, e.y);
        });
    };

    return controller;
})();

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
[system] = an object containing engine and platform information; see API documentation for details.
[options] = an object with optional parameters; see API documentation for details.
*/

// Uncomment the following BLOCK to expose PS.init() event handler:

PS.init = function( system, options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin with a call to PS.gridSize( x, y )
	// where x and y are the desired initial dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the default dimensions (8 x 8).
	// Uncomment the following code line and change the x and y parameters as needed.

	PS.gridSize( 14, 18 );
    PS.border(PS.ALL, PS.ALL, 0);
    PS.borderColor(PS.ALL, PS.ALL, 0);

    game_controller.getBeadList().forEach(function(e) {
        for (let i = 0, j; i < 2; i++) {
            for (j = 0; j < 2; j++) {
                PS.data(e.x + i, e.y + j, e);
            }
        }
    });
    score_controller.reset();

	// This is also a good place to display your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and change the string parameter as needed.

	PS.statusText( "Sanduhrperlenspiel" );

	// Add any other initialization code you need here.
};

/*
PS.touch ( x, y, data, options )
Called when the mouse button is clicked on a bead, or when a bead is touched.
It doesn't have to do anything.
[x] = zero-based x-position of the bead on the grid.
[y] = zero-based y-position of the bead on the grid.
[data] = the data value assigned to this bead by a call to PS.data(); default = 0.
[options] = an object with optional parameters; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead.

    score_controller.click(data);
};
