import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { GuildConfigModel } from "../../models/guildConfigModel.js";
import { EventModel } from "../../models/eventModel.js";
import { FollowUpEmbed, EmbedColors } from "../../utility/followUpEmbed.js";

export const data = new SlashCommandBuilder()
    .setName('event-set-active')
    .setDescription('Set the event as active/default for this server. All commands will automatically use this event.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('The unique tag/id of the event.')
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
    const event = await EventModel.findById(eventId);
    if (!event) {
        await interaction.followUp({
            embeds: [FollowUpEmbed(
                'Error',
                `No event found with the tag ${eventId}.`,
                EmbedColors.ERROR,
            )],
        });
        return;
    }
    if (event.archiveState) {
        await interaction.followUp({
            embeds: [FollowUpEmbed(
                'Error',
                `The event **${event.name}** is archived.`,
                EmbedColors.ERROR,
            )],
        });
        return;
    }

    await GuildConfigModel.findByIdAndUpdate(
        interaction.guild.id,
        { activeEvent: eventId },
        { upsert: true },
    );

    await interaction.followUp({
        embeds: [FollowUpEmbed(
            'Success',
            `Set the event **${event.name}** as the default/active event for the guild **${interaction.guild.name}**.`,
            EmbedColors.SUCCESS,
        )],
    });
}