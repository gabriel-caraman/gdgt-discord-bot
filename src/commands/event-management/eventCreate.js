import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { EventModel } from "../../models/eventModel.js";

export const data = new SlashCommandBuilder()
    .setName('event-create')
    .setDescription('Create a new event.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Name of the event.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('Unique tag of the event (alphanumerical values only).')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('default-stage')
            .setDescription('Default/first stage of the event (default: Qualifiers).')
    );

export async function execute(interaction) {
    await interaction.deferReply();

    if (!WhitelistCheck(interaction.user.id)) {
        await interaction.followUp('You are not whitelisted for this action.');
        return;
    }

    const eventTag = interaction.options.getString('tag').toUpperCase();
    const tagRegex = /^[A-Z0-9]+$/;
    if (!tagRegex.test(eventTag)) {
        await interaction.followUp('The event tag can only contain alphanumeric values.');
        return;
    }
    if (await EventModel.exists({ _id: eventTag })) {
        await interaction.followUp(`An event already has the ${eventTag} tag.`);
        return;
    }

    const eventName = interaction.options.getString('name');
    const eventDefaultStage = interaction.options.getString('default-stage') ?? 'Qualifiers';

    const event = new EventModel({
        _id: eventTag,
        name: eventName,
        stages: [{
            stageName: eventDefaultStage,
            stageOrder: 1,
        }],
        teamSizeMin: 2,
        teamSizeMax: 5,
        registrationsState: false,
        submissionsState: false,
    });

    await event.save();
    await interaction.followUp(`Successfully created the event ${eventName}.`);
}