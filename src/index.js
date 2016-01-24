"use strict";

import serve from 'koa-static-folder';
import xhr from 'koa-request-xhr';
import Koa from 'koa';
import hbs from 'koa-hbs';
import KoaRouter from 'koa-router';
import parse from 'co-body';
import TicTacToeGame from './gamelib/tictactoeGame';
import Persistence from './gamelib/base/persistence';
import config from './config/config';
import 'babel-core/register';
import 'babel-polyfill';

let app = Koa();
let router = KoaRouter();
let persistence = new Persistence(config.mongodb);
let game = new TicTacToeGame(persistence);

app.use(xhr());
app.use(serve('./src/public'));
app.use(hbs.middleware({
    viewPath: __dirname + '/../src/views'
}));

router.get('/', function* (next) {

    //Determine if ip is new and who it belongs to (player1, player2 or spectator)
    if( !game.getIPAddressForPlayer(TicTacToeGame.PLAYER_ONE)
        || !game.getIPAddressForPlayer(TicTacToeGame.PLAYER_TWO)) {
        game.registerPlayer(this.ip);
        //step through game logic
        game.doGameLogicStep();
    }

    this.body = yield this.render('game', { gameData: game.getGameData() });
});

router.post('/', function* (next) {
    let player = null;

    if(game.getIPAddressForPlayer(TicTacToeGame.PLAYER_ONE) == this.ip) {
        player = TicTacToeGame.PLAYER_ONE;
    } else if (game.getIPAddressForPlayer(TicTacToeGame.PLAYER_TWO) == this.ip) {
        player = TicTacToeGame.PLAYER_TWO;
    } else return;

    let data = parse(this);

    game.board.setSquare(data.square, player);
    game.doGameLogicStep();

    this.redirect('/');
});

router.get('/ajax', function* (next){
    if (this.request.xhr) {
        this.body = { gameData: game.getGameData() };
        this.statusCode = 200;
    }
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.port);
