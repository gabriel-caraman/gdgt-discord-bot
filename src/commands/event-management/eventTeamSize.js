import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { ActiveEventCheck } from "../../utility/activeEventCheck.js";
import { EventModel } from "../../models/eventModel.js";

export const data = new SlashCommandBuilder()
    .setName('event-team-size')
    .setDescription('Change the team size of the active event.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption(option =>
        option.setName('min')
            .setDescription('Smallest possible amount of people in a team.')
            .setRequired(true)
            .setMinValue(0)
    )
    .addIntegerOption(option =>
        option.setName('max')
            .setDescription('Largest possible amount of people in a team.')
            .setRequired(true)
            .setMinValue(0)
    );

export async function execute(interaction) {
    await interaction.deferReply();

    if (!WhitelistCheck(interaction.user.id)) {
        await interaction.followUp('You are not whitelisted for this action.');
        return;
    }

    const activeEventTag = await ActiveEventCheck(interaction.guild.id);
    if (!activeEventTag) {
        await interaction.followUp('No active event set for this server.');
        return;
    }

    const tsMin = interaction.options.getInteger('min');
    const tsMax = interaction.options.getInteger('max');
    if (tsMin > tsMax) {
        await interaction.followUp('The minimal value cannot be larger than the maximum value.');
        return;
    }

    const activeEvent = await EventModel.findByIdAndUpdate(
        activeEventTag,
        { 
            teamSizeMin: tsMin,
            teamSizeMax: tsMax,
        },
        { returnDocument: 'after' },
    );

    await interaction.followUp(`Updated team size for ${activeEvent.name}: ${tsMin}-${tsMax}`);
}