"use strict";
/**
 * Created by lehel kovach:
 *
 */
import koa from 'koa';
import TicTacToeGame from 'tictactoeGame';

var app = koa();

router.get('/', function *(next) {
    let game = TicTacToeGame.instance();

    //get game state
    //get player
    //display proper output for player
    //get winner
    //doGameLogic
    //loop
});


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
