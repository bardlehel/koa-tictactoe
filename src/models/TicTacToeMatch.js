"use strict";


import mongoose from 'mongoose';
import {Schema} from 'mongoose';

var TicTacToeMatchSchema = new Schema({
    board: Object,
    players: Array,
    state: Object,
    started: Date
});

export default mongoose.model('TicTacToeMatch',TicTacToeMatchSchema);