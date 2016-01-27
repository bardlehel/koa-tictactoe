"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gameData = require('./gameData');

var _gameData2 = _interopRequireDefault(_gameData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CheckerBoard extends _gameData2.default {
    constructor(size, persistence) {
        super(persistence);
        this.data.boardSize = size;
        this.data.grid = [];
        for (var i = 0; i != 9; i++) {
            this.data.grid[i] = null;
        }
    }

    setSquare(n, val) {
        if (isNaN(n) || n < 1 || n >= Math.pow(this.data.boardSize, 2)) throw new Error('bad index for board');

        this.data.grid[n] = val;
    }

    getSquare(n) {
        if (isNaN(n) || n < 1 || n >= Math.pow(this.data.boardSize, 2)) throw new Error('bad index for board');

        return this.data.grid[n];
    }

    get IterableSquares() {
        let iter = {};
        iter[Symbol.iterator] = function* () {
            for (let i = 0; i != this.data.grid.length; i++) yield {
                value: this.data.grid[i],
                index: i
            };
        };

        return iter;
    }

    getFilledSquares() {
        let val = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        let count = 0;
        for (let square of this.IterableSquares) {
            if (square) {
                if (val && val == square.value || !val) count++;
            }
            return count;
        }
    }
}

exports.default = CheckerBoard;