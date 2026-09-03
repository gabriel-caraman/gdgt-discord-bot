import { EmbedBuilder } from "discord.js"

export function FollowUpEmbed(header, content, color) {
    const embed = new EmbedBuilder()
        .setTitle(header)
        .setDescription(content)
        .setColor(color);
    return embed;
}

export const EmbedColors = {
    SUCCESS: "#4CAF50",
    ERROR: "#F44336",
    INFO: "#a4accf",
    INACTIVE: "#4c4f5f"
}