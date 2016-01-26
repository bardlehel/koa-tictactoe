"use strict";

import GameData from './gameData';

class CheckerBoard extends GameData {
    constructor(size, persistence) {
        super(persistence);
        this.data.size = size;
        this.data.grid = [];
        for(var i=0; i!=9;i++) {this.data.grid[i] = null; }
        console.log(this.data.grid);
    }

    setSquare(x, y, val) {
        if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= this.data.size || y >= this.data.size)
            throw new Error('bad index for board');

        if (val === undefined || val === '')
            val = null;

        setSqaure(this.data.size * x + y, val);
    }

    setSquare(n, val) {
        if (isNaN(n) || n < 0 || n >= this.data.size ^ 2)
            throw new Error('bad index for board');

        this.data.grid[n] = val;
    }

    getSquare(x, y) {
        if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= this.data.size || y >= this.data.size)
            throw new Error('bad index for board');

        return getSquare(this.data.size * x + y);
    }

    getSquare(n) {
        if (isNaN(n) || n < 0 || n >= this.data.size ^ 2)
            throw new Error('bad index for board');

        return this.data.grid[n];
    }


    get IterableSquares() {
        let iter = {};
        iter[Symbol.iterator] = function* () {
            for (let i = 0; i != this.data.grid.length; i++)
                yield {
                    value: this.data.grid[i],
                    index: i
                };
        };

        return iter;
    }

    getFilledSquares(val=null) {
        let count = 0;
        for (let square of this.IterableSquares) {
            if (square) {
                if ((val && val == square.value) || (!val))
                    count++;
            }
            return count;
        }
    };
}

export default CheckerBoard;