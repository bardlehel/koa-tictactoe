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

let app = module.exports = Koa();
let router = KoaRouter();
let persistence = new Persistence(config.mongodb);
let game = new TicTacToeGame(persistence);
app.game = game;

function handleError(err) {
    console.log('server error', err);
    process.exit(1);
}

app.on('error', handleError);


app.use(xhr());
app.use(serve('./src/public'));
router.use(hbs.middleware({
    viewPath: __dirname + '/../src/views'
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

    //Determnextsine if ip is new and who it belongs to (player1, player2 or spectator)
    if( !game.getIPAddressForPlayer(TicTacToeGame.PLAYER_ONE)
        || !game.getIPAddressForPlayer(TicTacToeGame.PLAYER_TWO)) {

        game.registerPlayer(this.ip);

        //step through game logic
        game.doGameLogicStep();
    }

    let data = getDataForClient(this.ip);
    this.status = 200;
    let x = yield this.render('game', {});
    console.log(x);
    this.body = yield this.render('game', data);
});

router.post('/', function* () {
    console.log('handling POST /');
    let role = getClientGameRole(this.ip);
    let data = parse(this);

    if(role == TicTacToeGame.SPECTATOR)
        return;

    game.board.setSquare(data.square, role);
    game.doGameLogicStep();

    this.status = 200;
    this.redirect('/');
});

router.get('/ajax', function* (){
    console.log('handling GET /ajax/');

    if (this.request.xhr) {
        console.log('before');
        this.body = getDataForClient(this.ip);
        this.status = 200;
    }
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.port, '192.168.0.4', function(err) {
    if(err) handleError(err);

    console.log('listening on Port:' + config.port);
});
