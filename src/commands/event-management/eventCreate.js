import { SlashCommandBuilder } from "discord.js";
import { EventModel } from "../../models/eventModel.js";

export const data = new SlashCommandBuilder()
    .setName('event-create')
    .setDescription('Create a new event.')
    // add check for admin privileges
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Name of the tournament.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('Unique tag of the tournament (alphanumerical values only).')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('default-stage')
            .setDescription('Default/first stage of the tournament (default: Qualifiers).')
    );

export async function execute(interaction) {
    const eventName = interaction.options.getString('name');
    // add check for ascii characters only

    const eventTag = interaction.options.getString('tag');
    // add check for alphanumerical values only

    const eventDefaultStage = interaction.options.getString('default-stage') ?? 'Qualifiers';

    const event = new EventModel({
        name: eventName,
        tag: eventTag,
        defaultStage: eventDefaultStage,
    });

    await event.save();
    await interaction.reply(`Successfully created the event ${eventName}.`);
}