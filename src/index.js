"use strict";

import serve from 'koa-static-folder';
import xhr from 'koa-request-xhr';
import Koa from 'koa';
import handlebars from "koa-handlebars";
import KoaRouter from 'koa-router';
import parse from 'co-body';
import TicTacToeGame from './gamelib/tictactoeGame';
import Persistence from './gamelib/base/persistence';
import GameSchema from './models/TicTacToeGameState';
import config from './config/config';
import 'babel-core/register';
import 'babel-polyfill';

let app = module.exports = Koa();
let router = KoaRouter();
let persistence = new Persistence(config.mongodb, GameSchema);
let game = new TicTacToeGame(persistence);
app.game = game;

function handleError(err) {
    console.log('server error', err);
    process.exit(1);
}

app.on('error', handleError);


app.use(xhr());
app.use(serve('./public'));
router.use(handlebars({
    viewsDir: '/src/views',
    layoutsDir: '/src/layouts',
    defaultLayout: 'main'
}));

function getClientGameRole(clientIP) {
    let client = TicTacToeGame.SPECTATOR;

    if(game.getIPAddressForPlayer(TicTacToeGame.PLAYER_ONE) == clientIP) {
        client = TicTacToeGame.PLAYER_ONE;
    } else if(game.getIPAddressForPlayer(TicTacToeGame.PLAYER_TWO) == clientIP) {
        client = TicTacToeGame.PLAYER_TWO;
    }

    return client;
}

function getDataForClient(clientIP) {
    return {
        gameData: game.getGameData(),
        client: getClientGameRole(clientIP)
    };
}

router.get('/', function* () {

    console.log('handling GET /');

    //Determine if ip is new and who it belongs to (player1, player2 or spectator)
    if( !game.getIPAddressForPlayer(TicTacToeGame.PLAYER_ONE)
        || !game.getIPAddressForPlayer(TicTacToeGame.PLAYER_TWO)) {

        game.registerPlayer(this.ip);

        //step through game logic
        game.doGameLogicStep();
    }

    let data = getDataForClient(this.ip);
    this.status = 200;
    yield this.render("index", {
        data: data,
        ajaxEndpoint: this.request.origin + '/ajax'
    });
});

router.post('/', function* () {
    console.log('handling POST /');
    let role = getClientGameRole(this.ip);
    let data = yield parse(this);

    if(role == TicTacToeGame.SPECTATOR)
        return;

    if(game.getPlayerTurn() !== role)
        return;

    let squareNum = parseInt(data.square);
    if(isNaN(squareNum) || squareNum < 0 || squareNum > 9)
        return;

    console.log(squareNum);
    game.board.setSquare(squareNum, role);
    console.log('after setSquare');
    game.doGameLogicStep();

    this.status = 200;
    this.redirect('/');
});

router.get('/ajax', function* (){
    console.log('handling GET /ajax/');

    this.status = 200;

    yield this.body =  {
        data: getDataForClient(this.ip),
        ajaxEndpoint: this.request.origin + '/ajax'
    };
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.port, '0.0.0.0', function(err) {
    if(err) handleError(err);

    console.log('listening on Port:' + config.port);
});
