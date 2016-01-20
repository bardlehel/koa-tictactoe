"use strict";

import {serve} from 'koa-static-folder';
import xhr from 'koa-request-xhr';
import koa from 'koa';
import hbs from 'koa-hbs';
import TicTacToeGame from 'tictactoeGame';

var app = koa();
app.use(xhr());

app.use(serve('./public'));

app.use(hbs.middleware({
    viewPath: __dirname + '/views'
}));

router.get('/', function* (next) {
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

app.listen(3000);
