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
        this.data.size = size;
        this.data.grid = [[], []];
    }

    setSquare(x, y, char) {
        if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= this.data.size || y >= this.data.size) throw new Error('bad index for board');

        if (char === undefined || char === '') char = null;

        this.data.grid[([x], [y])] = char;
    }

    getSquare(x, y) {
        if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= this.data.size || y >= this.data.size) throw new Error('bad index for board');

        var ret = this.data.grid[([x], [y])];

        if (ret === undefined) return null;
    }

    getFilledSquares() {
        let type = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        let count = 0;
        for (let x = 0; x != this.data.size; x++) {
            for (let y = 0; y != this.data.size; y++) {
                let square = this.getSquare(x, y);
                if (square) {
                    if (type && type == square || !type) count++;
                }
            }
        }
        return count;
    }
};

exports.default = CheckerBoard;