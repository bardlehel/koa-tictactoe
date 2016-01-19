/**
 * Created by Lehel Kovach.
 */


let _grid = Symbol();
let _size = Symbol();

class CheckerBoard {
    constructor(size) {
        this[_size] = size;
        this[_grid] = [[],[]];
    }

    setSquare(x, y, char) {
        if(isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= this[_size] || y >= this[_size])
            throw new Error('bad index for board');

        if(char === undefined || char === '')
            char = null;

        this[_grid][[x], [y]] = char;
    }

    getSquare(x, y) {
        if(isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= this[_size] || y >= this[_size])
            throw new Error('bad index for board');

        var ret = this[_grid][[x], [y]];

        if(ret === undefined) return null;
    }
};

export default CheckerBoard();