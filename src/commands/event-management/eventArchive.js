import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { EventModel } from "../../models/eventModel.js";
import { FollowUpEmbed, EmbedColors } from "../../utility/followUpEmbed.js";

export const data = new SlashCommandBuilder()
    .setName('event-archive')
    .setDescription('Archive/unarchive an event. Archived events cannot be modified.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('The unique tag of the event.')
            .setRequired(true)
    )
    .addBooleanOption(option =>
        option.setName('state')
            .setDescription('True - archived; False - active')
            .setRequired(true)
    );

export async function execute(interaction) {
    await interaction.deferReply();

    if (!WhitelistCheck(interaction.user.id)) {
        await interaction.followUp({
            embeds: [FollowUpEmbed(
                'Error',
                'You are not whitelisted for this action.',
                EmbedColors.ERROR,
            )],
        });
        return;
    }

    const eventId = interaction.options.getString('tag').toUpperCase();
    const eventQuery = await EventModel.findById(eventId);
    if (!eventQuery) {
        await interaction.followUp({
            embeds: [FollowUpEmbed(
                'Error',
                `No event found with the tag ${eventId}.`,
                EmbedColors.ERROR,
            )],
        });
        return;
    }

    const archiveState = interaction.options.getBoolean('state');
    eventQuery.archiveState = archiveState;

    await eventQuery.save();
    const archiveString = archiveState ? 'archived' : 'opened';
    await interaction.followUp({
        embeds: [FollowUpEmbed(
            'Success',
            `The event **${eventQuery.name}**  has been **${archiveString}.**`,
            EmbedColors.SUCCESS,
        )],
    });
}