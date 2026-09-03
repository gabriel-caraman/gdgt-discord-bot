import { Schema, model } from "mongoose";

const teamSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    name: String,
    event: String,
    captain: String,
    members: [{
        member: String,
    }],
});

export const TeamModel = model('Team', teamSchema);