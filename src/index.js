"use strict";

import serve from 'koa-static-folder';
import xhr from 'koa-request-xhr';
import Koa from 'koa';
import handlebars from "koa-handlebars";
import KoaRouter from 'koa-router';
import config from './config/config';
import controller from './controllers/tictactoeController';
import 'babel-core/register';
import 'babel-polyfill';

let app = module.exports = Koa();
let router = KoaRouter();


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
    console.log('handling GET /');
    yield controller.getGame(this);
});

router.post('/', function* () {
    console.log('handling POST /');
    yield controller.postMove(this);
});

router.get('/ajax', function* (){
    console.log('handling GET /ajax/');
    yield controller.getCurrentGameState(this);
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.port, '0.0.0.0', function(err) {
    if(err) handleError(err);

    console.log('listening on Port:' + config.port);
});
