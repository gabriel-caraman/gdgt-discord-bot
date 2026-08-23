import { Schema, model } from "mongoose";

const eventSchema = new Schema({
    // bare minimum for now
    name: String,
    tag: String,
    defaultStage: String,

    /*
    id: {
        type: Schema.Types.ObjectId,
    },
    name: String,
    tag: String,
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team',
    }],
    levels: [{
        type: Schema.Types.ObjectId,
        ref: 'Level',
    }],
    stages: [{
        type: String
    }],
    */
});

export const EventModel = model('Event', eventSchema);