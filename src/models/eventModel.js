import { Schema, model } from "mongoose";

const eventSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    name: String,
    stages: [{
        stageName: {
            type: String,
            unique: true,
        },
        stageOrder: Number,
    }],
    teamSizeMin: Number,
    teamSizeMax: Number,
    registrationsState: Boolean,
    submissionsState: Boolean,
});

export const EventModel = model('Event', eventSchema);