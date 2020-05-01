//Hourglass bead game (das Sanduhrperlenspiel)
//by Benjamin Carlson

let game_controller = (function() {
    let shuffle = (function(){
        let addWeight = (e) => [Math.random(), e];
        let sortAlg = (a, b) => (a[0] - b[0]);
        let stripWeight = (e) => e[1];

        return function(arr) {
            return arr.map(addWeight).sort(sortAlg).map(stripWeight);
        };
    })();

    //[x, y, left, right, color]
    let bead_data = ([
        [1, 0, null, null, null],
        [3, 0, null, null, null],
        [5, 0, null, null, null],
        [7, 0, null, null, null],
        [0, 2, null, 0, null],
        [2, 2, 0, 1, null],
        [4, 2, 1, 2, null],
        [6, 2, 2, 3, null],
        [8, 2, 3, null, null],
        [1, 4, 4, 5, null],
        [3, 4, 5, 6, null],
        [5, 4, 6, 7, null],
        [7, 4, 7, 8, null],
        [0, 6, null, 9, null],
        [2, 6, 9, 10, null],
        [4, 6, 10, 11, null],
        [6, 6, 11, 12, null],
        [8, 6, 12, null, null],
        [1, 8, 13, 14, null],
        [3, 8, 14, 15, null],
        [5, 8, 15, 16, null],
        [7, 8, 16, 17, null],
        [0, 10, null, 18, null],
        [2, 10, 18, 19, null],
        [4, 10, 19, 20, null],
        [6, 10, 20, 21, null],
        [8, 10, 21, null, null],
        [1, 12, 22, 23, null],
        [3, 12, 23, 24, null],
        [5, 12, 24, 25, null],
        [7, 12, 25, 26, null],
        [2, 14, 27, 28, null],
        [4, 14, 28, 29, null],
        [6, 14, 29, 30, null],
        [3, 16, 31, 32, null],
        [5, 16, 32, 33, null]
    ]).map(function(e) {
        let ret = Object.create(null);
        ret.x = e[0];
        ret.y = e[1];
        ret.left = e[2];
        ret.right = e[3];
        ret.color = e[4];

        return ret;
    });
    let colors = [0xff0000, 0x00ff00, 0x0000ff];

    let layer_colors = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
        colors[2]
    ];

    function getLayers() {
        return shuffle(layer_colors)
            .concat(
                shuffle(layer_colors),
                shuffle(layer_colors),
                shuffle(layer_colors)
            );
    }

    let controller = Object.create(null);
    controller.getBeadData = function(index) {
        index = Math.min(bead_data.length, Math.max(0, index));
        return bead_data[index];
    };
    controller.getBeadList = function() {
        return bead_data;
    };
    controller.setBeadColors = function() {
        for (let i = 0, col = getLayers(); i < bead_data.length; i++) {
            bead_data[i].color = col[i];
        }
    };
    controller.getColors = function() {
        return colors;
    };

    return controller;
})();
