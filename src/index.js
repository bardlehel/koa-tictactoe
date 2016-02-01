"use strict";

import serve from 'koa-static-folder';
import xhr from 'koa-request-xhr';
import Koa from 'koa';
import handlebars from "koa-handlebars";
import KoaRouter from 'koa-router';
import config from './config/config';
import controller from './controllers/tictactoeController';
import {startGame} from './controllers/tictactoeController';
import 'babel-core/register';
import 'babel-polyfill';

let app = module.exports = Koa();
let router = KoaRouter();

app.startGame = startGame;

function handleError(err) {
    console.log('server error', err);
    console.log(err.stack);
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

router.get('/', function* () {
    yield controller.getGame(this);
});

router.post('/', function* () {
    yield controller.postMove(this);
});

router.get('/ajax', function* () {
    yield controller.getCurrentGameState(this);
});

app
    .use(router.routes())
    .use(router.allowedMethods());

let gameStartCallback = function () {
    console.log('game started.');

    app.server = app.listen(config.port, '0.0.0.0', function(err) {
        if(err) handleError(err);

        if(app.gameStartCallback)
            app.gameStartCallback();

        console.log('listening on Port:' + config.port);
    });
}

app.startGame(gameStartCallback);

