import { Schema, model } from "mongoose";

const playerSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    badges: [{
        badge: String,
    }],
    // TO DO: add levels
});

export const PlayerModel = model('Player', playerSchema);