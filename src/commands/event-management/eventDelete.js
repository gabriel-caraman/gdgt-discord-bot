import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import "dotenv/config";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { EventModel } from "../../models/eventModel.js";
import { GuildConfigModel } from "../../models/guildConfigModel.js";

export const data = new SlashCommandBuilder()
    .setName('event-delete')
    .setDescription('Delete an event by tag. Admin & whitelist locked.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('The unique tag of the event.')
            .setRequired(true)
    );

export async function execute(interaction) {
    await interaction.deferReply();

    if (!WhitelistCheck(interaction.user.id)) {
        await interaction.followUp('You are not whitelisted for this action.');
        return;
    }

    const deletedEventId = interaction.options.getString('tag').toUpperCase();
    const deleteResult = await EventModel.deleteOne({ _id: deletedEventId });
    if (deleteResult.deletedCount == 0) {
        await interaction.followUp(`No event found with the tag ${deletedEventId}.`);
        return;
    }

    await GuildConfigModel.findOneAndUpdate(
        { activeEvent: deletedEventId },
        { activeEvent: null },
    );

    await interaction.followUp(`Successfully deleted the event with the tag ${deletedEventId}.`);
}