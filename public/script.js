"use strict";

var ajaxUrl = ""; //defined in handlebars template
let canClick = true;
let xImagePath = "";
let oImagePath = "";
let context;
let timer = null;
let clientRole = null;

const SPECTATOR = -1;
const PLAYER_X = 0;
const PLAYER_O = 1;

function updateGame(gameData) {

    $('#loading-message').hide();
    $('#main-section').show();

    if(!gameData || !gameData.data)
        return;

    let data = gameData.data.gameData;

    if(!data || !data.board || !data.state ) {
        alert('Not getting correct data from server!');
        return;
    }


    clientRole = gameData.data.client;
    let board = data.board;
    let gameState = data.state.state.name;
    let playerTurn = data.state.turn;
    let winner = data.state.turn;
    let message = data.message;
    let roleText = 'You are a spectator';

    if(clientRole === PLAYER_X)
        roleText = 'You are X';
    else if(clientRole = PLAYER_O)
        roleText = 'Your are O';

    $("#role").html(roleText);
    $("#message").html(message);

    for (let square = 0; square < board.length; square++) {
        let boxIndex = square + 1;

        if(board[square] === PLAYER_X) {
            $("#box" + boxIndex).html('<img src="' + xImagePath + '" />');
            $("#box" + boxIndex).data('state', 'x');
        } else if(board[square] === PLAYER_O) {
            $("#box" + boxIndex).html('<img src="' + oImagePath + '" />');
            $("#box" + boxIndex).data('state', 'o');
        } else {
            $("#box" + boxIndex).html();
            $("#box" + boxIndex).data('state', null);
        }
    }
}

$(document).ready(function() {

    $('#main-section').hide();

    timer = setInterval(function() {
        $.getJSON(ajaxUrl, function(data) {
            updateGame(data);
        });
    }, 3000);

    $("#board div").click(function() {
        //don't allow filled box to be clicked on...
        if ($(this).data('state'))
            return;
        //don't allow spectator to input
        if(clientRole === -1)
            return;

        //get the id of this clicked box and send it to the server
        let squareNum = $(this).attr('id').substring(3,4);
        let newUrl = ajaxUrl.replace('ajax', '');
        $.post( newUrl, { square: squareNum }, function (data, status) {
            updateGame(data);
        });
    });
});
