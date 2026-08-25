import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { GuildConfigModel } from "../../models/guildConfigModel.js";
import { EventModel } from "../../models/eventModel.js";

export const data = new SlashCommandBuilder()
    .setName('event-set-active')
    .setDescription('Sets the event as active/default for this server. All commands will automatically use this event.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('The unique tag/id of the event.')
            .setRequired(true)
    );

export async function execute(interaction) {
    await interaction.deferReply();

    if (!WhitelistCheck(interaction.user.id)) {
        await interaction.followUp('You are not whitelisted for this action.');
        return;
    }

    const eventTag = interaction.options.getString('tag').toUpperCase();
    if (!await EventModel.exists({ _id: eventTag})) {
        await interaction.followUp(`No event has been found with the ${eventTag} tag.`);
        return;
    }

    //to do: check if event is archived

    await GuildConfigModel.findOneAndUpdate(
        { _id: interaction.guild.id },
        { activeEvent: eventTag },
        { upsert: true },
    );

    await interaction.followUp(`Set the ${eventTag} event as the default/active event.`);
}