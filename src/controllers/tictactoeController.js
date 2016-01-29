"use strict";

import TicTacToeGame from '../gamelib/tictactoeGame';
import Persistence from '../gamelib/base/persistence';
import GameSchema from '../models/TicTacToeGameState';
import config from '../config/config';
import parse from 'co-body';

let persistence = new Persistence(config.mongodb, GameSchema);
let game = new TicTacToeGame(persistence);


let getClientGameRole = function (clientIP) {
    let client = TicTacToeGame.SPECTATOR;

    if(game.getIPAddressForPlayer(TicTacToeGame.PLAYER_ONE) == clientIP) {
        client = TicTacToeGame.PLAYER_ONE;
    } else if(game.getIPAddressForPlayer(TicTacToeGame.PLAYER_TWO) == clientIP) {
        client = TicTacToeGame.PLAYER_TWO;
    }

    return client;
}

let getDataForClient = function (clientIP) {
    return {
        gameData: game.getGameData(),
        client: getClientGameRole(clientIP)
    };
}

class TicTacToeController {
    constructor() {

    }

    *getGame(koa) {
        //Determine if ip is new and who it belongs to (player1, player2 or spectator)
        if( !game.getIPAddressForPlayer(TicTacToeGame.PLAYER_ONE)
            || !game.getIPAddressForPlayer(TicTacToeGame.PLAYER_TWO)) {

            game.registerPlayer(koa.ip);

            //step through game logic
            yield game.doGameLogicStep();
        }

        let data = getDataForClient(this.ip);
        koa.status = 200;

        yield koa.render("index", {
            data: data,
            ajaxEndpoint: koa.request.origin + '/ajax'
        });
    }

    *postMove(koa) {
        let role = getClientGameRole(koa.ip);
        let data = yield parse(koa);

        if(role == TicTacToeGame.SPECTATOR)
            return;

        if(game.getPlayerTurn() !== role)
            return;

        let squareNum = parseInt(data.square);
        if(isNaN(squareNum) || squareNum < 0 || squareNum > 9)
            return;

        yield game.board.setSquare(squareNum, role);
        yield game.doGameLogicStep();

        koa.status = 200;
        koa.redirect('/');
    }

    *getCurrentGameState(koa) {
        koa.status = 200;

        yield koa.body =  {
            data: getDataForClient(koa.ip),
            ajaxEndpoint: koa.request.origin + '/ajax'
        };
    }
}

let controller = new TicTacToeController();

export default controller;


