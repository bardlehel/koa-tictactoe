"use strict";

import serve from 'koa-static-folder';
import xhr from 'koa-request-xhr';
import Koa from 'koa';
import hbs from 'koa-hbs';
import KoaRouter from 'koa-router';
import TicTacToeGame from './gamelib/tictactoeGame';
import Persistence from './gamelib/base/persistence';
import config from './config/config';
import register from 'babel-core/register';
import polyfill from 'babel-polyfill';

let app = Koa();
let router = KoaRouter();

app.use(xhr());

app.use(serve('./src/public'));

app.use(hbs.middleware({
    viewPath: __dirname + '/views'
}));

router.get('/', function* (next) {
    let persistence = new Persistence(config.mongodb)
    let game = TicTacToeGame.instance();

    yield this.render('startgame', { launcherURL: '' });
});


router.get('/ajax', function* (next){
    if (this.request.xhr) {
        this.body = { message: 'Hello World' };
    }
});



app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.port);
