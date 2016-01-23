"use strict";

import {expect} from 'chai';
import TicTacToeGame from '../../../src/gamelib/tictactoeGame';
import Persistence from '../../../src/gamelib/base/persistence';

var getNewGame = ()=> {
    try {
        return new TicTacToeGame(new Persistence('mongodb://blah'));
    } catch(err) { throw err; }
};

describe('TicTacToeGame', function() {
    describe('constructor', function () {
        it('should return a TicTacToeGame object', function() {
            expect(getNewGame().constructor.name).to.equal('TicTacToeGame');
        });

        it('should not be able to create more than one game', function () {
            expect(getNewGame).to.throw(Error);
        });
    });
});
