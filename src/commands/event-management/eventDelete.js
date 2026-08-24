import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { EventModel } from "../../models/eventModel.js";
import "dotenv/config";

export const data = new SlashCommandBuilder()
    .setName('event-delete')
    .setDescription('Deletes an event by tag. Admin & whitelist locked.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('The unique tag of the event.')
            .setRequired(true)
    );


export async function execute(interaction) {
    await interaction.deferReply();

    const whitelistedAdminIds = process.env.WHITELISTED_ADMIN_IDS.split(',');
    if (!whitelistedAdminIds.includes(interaction.user.id)) {
        await interaction.followUp('You are not whitelisted for this action.');
        return;
    }

    const deletedEventId = interaction.options.getString('tag').toUpperCase();
    const deleteResult = await EventModel.deleteOne({ _id: deletedEventId });

    if (deleteResult.deletedCount == 0) {
        await interaction.followUp(`No event found with the tag ${deletedEventId}.`);
        return;
    }
    await interaction.followUp(`Successfully deleted the event with the tag ${deletedEventId}.`);
}