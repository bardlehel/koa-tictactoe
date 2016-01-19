/**
 * Created by lehel on 1/18/16.
 */

import PersistentGameState from 'persistentGameState';
import mongoose from 'mongoose';
import GameStateModel from 'tictactoeGameState';

//private member properties
let _mongooseConn = Symbol();
let _mongoDocumentID = Symbol();

class PersistentGameState extends GameState {
    constructor(gameInstance, mongoConnURL) {
        super(gameInstance);
        this.gameState = new Per
        this[_mongooseConn] = yield mongoose.connect(mongoConnURL);
        this.createNewGame();
    }

    *createNewGame() {
        var newGameState = new GameStateModel();
        newGameState.started = new Date();
        yield newGameState.save();
        this[_mongoDocumentID] = newGameState.id;
    }

    *saveGame() {
        var result = yield mongoose.findOne({ id: this[_mongoDocumentID] }).exec();
        result.state = this.state;
        result.turn = this.turn;
        result.winner = this.winner;
        yield result.save();
    }

};

export default PersistentGameState;