import { Schema, model } from "mongoose";

const eventSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    name: String,
    stages: [{
        stageName: String,
        stageOrder: Number,
    }],
});

export const EventModel = model('Event', eventSchema);