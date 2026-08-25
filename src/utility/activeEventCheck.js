import { GuildConfigModel } from "../models/guildConfigModel.js"

export async function ActiveEventCheck(guildId) {
    const result = await GuildConfigModel.findById(guildId);
    return result.activeEvent;
}