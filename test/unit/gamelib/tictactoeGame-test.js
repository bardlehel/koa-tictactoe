"use strict";

import mocha from 'mocha';
import coMocha from 'co-mocha';
import {expect} from 'chai';
import TicTacToeGame from '../../../src/gamelib/tictactoeGame';
import Persistence from '../../../src/gamelib/base/persistence';
import {MOCK_CONNECTION} from '../../../src/gamelib/base/persistence';

coMocha(mocha);

var getNewGame = ()=> {
    try {
        return new TicTacToeGame(p);
    } catch(err) { throw err; }
};

var p = null;
var game = null;

before(function(done) {

    p  = new Persistence(MOCK_CONNECTION, null, function() {
        console.log('finished mock connection.');

        done();
    });
    game = getNewGame();
    p.connectCallback();
});

describe('TicTacToeGame', function() {
    describe('constructor', function () {
        it('should return a TicTacToeGame object', function() {
            expect(game.constructor.name).to.equal('TicTacToeGame');
        });

        it('should not be able to create more than one game', function () {
            expect(getNewGame).to.throw(Error);
        });

        it('should have two players', function() {
            expect(game.players.count).to.equal(2);
        });
    });

    describe('getPlayerByIndex', function() {
        it('should return a Player object for Player id of 0 or 1', function() {
            let player1 = game.players.getPlayerByIndex(0);
            expect(player1).to.exist;
            expect(player1.constructor.name).to.equal('Player');
        });
    });

    describe('registerPlayer', function() {
        it('should register first ip address as player 1', function*() {
            let ip = "1.1.1.1";
            yield game.registerPlayer(ip);
            expect(game.players.getPlayerByIndex(TicTacToeGame.PLAYER_ONE)).to.exist;
            expect(game.players.getPlayerByIndex(TicTacToeGame.PLAYER_ONE).ipAddress).to.equal(ip);
        });
    });

    describe('isGameOver', function() {
        it('should return false if game just started', function() {
            expect(game.isGameOver()).to.be.false;
        });
    });
});
