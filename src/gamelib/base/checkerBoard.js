"use strict";

import GameData from './gameData';

class CheckerBoard extends GameData {
    constructor(size, persistence) {
        super(persistence);
        this.data.size = size;
        this.data.grid = [[],[]];
    }

    setSquare(x, y, char) {
        if(isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= this.data.size || y >= this.data.size)
            throw new Error('bad index for board');

        if(char === undefined || char === '')
            char = null;

        this.data.grid[[x], [y]] = char;
    }

    getSquare(x, y) {
        if(isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= this.data.size || y >= this.data.size)
            throw new Error('bad index for board');

        var ret = this.data.grid[[x], [y]];

        if(ret === undefined) return null;
    }

    getFilledSquares(type=null) {
        let count = 0;
        for(let x = 0; x != this.data.size; x++) {
            for(let y = 0; y != this.data.size; y++) {
                let square = this.getSquare(x, y);
                if(square) {
                   if((type && type == square) || (!type))
                       count++;
               }
            }
        }
        return count;
    }
};

export default CheckerBoard;