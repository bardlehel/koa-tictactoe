"use strict";

import GameData from './gameData';

const BOARD_KEY = 'board';

class CheckerBoard extends GameData {
    constructor(size, persistence) {
        super(persistence, BOARD_KEY);
        this.data.boardSize = size;
        this.data.grid = [];
        for(var i=0; i!=9;i++) {this.data.grid[i] = null; }
    }


    *setSquare(n, val) {
        if (isNaN(n) || n < 1 || n > Math.pow(this.data.boardSize, 2))
            throw new Error('bad index for board');

        this.data.grid[n - 1] = val;

        yield this.save();
    }


    getSquare(n) {
        if (isNaN(n) || n < 1 || n > Math.pow(this.data.boardSize, 2))
            throw new Error('bad index for board');

        return this.data.grid[n - 1];
    }

    getSquareByXY(x, y) {
        if(isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= this.data.boardSize || y >= this.data.boardSize)
            throw new Error('bad index for board');

        return this.getSquare(this.data.boardSize * y + (x + 1));
    }


    get IterableSquares() {
        let iter = {};
        iter.data = this.data;

        iter[Symbol.iterator] = function* () {
            for (let i = 0; i != iter.data.grid.length; i++) {
                yield {
                    value: iter.data.grid[i],
                    index: i
                };
            }
        };

        return iter;
    }

    getFilledSquares(val=null) {
        let count = 0;

        for (let square of this.IterableSquares) {
            if (square.value !== null) {
                if (val === null || (val !== null && square.value === val)) {
                    count++;
                }
            }
        }

        return count;
    };
}

export default CheckerBoard;
export {BOARD_KEY};