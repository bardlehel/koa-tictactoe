"use strict";
/**
 * Created by lehel kovach:
 *
 */
import serve from 'koa-static-folder';
import xhr from 'koa-request-xhr';
import koa from 'koa';
import hbs from 'koa-hbs';
import TicTacToeGame from 'tictactoeGame';

var app = koa();

app.use(serve('./public'));

app.use(hbs.middleware({
    viewPath: __dirname + '/views'
}));

router.get('/', function *(next) {
    let game = TicTacToeGame.instance();

});

router.get('/ajax', function *(next){

});


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
