"use strict";
/**
 * Created by lehel kovach:
 *
 */
import koa from 'koa';
import TicTacToeGame from 'tictactoeGame';

var app = koa();

router.get('/', function *(next) {

});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
