/**
 * Created by Lehel Kovach.
 */
import * as mongoose  from 'mongoose';
import Schema from 'mongoose.Schema';
import Document from 'mongoose.Document';

var TicTacToeGameStateSchema = new Schema({
    state: String,
    player: Number,
    winner: Number,
    started: Date
});

export default mongoose.model('TicTacToeGameState',TicTacToeGameStateSchema);