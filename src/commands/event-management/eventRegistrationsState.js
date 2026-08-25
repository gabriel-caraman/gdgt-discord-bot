import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { ActiveEventCheck } from "../../utility/activeEventCheck.js";
import { EventModel } from "../../models/eventModel.js";

export const data = new SlashCommandBuilder()
    .setName('event-registrations-state')
    .setDescription('Open/close the registrations for the active event.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption(option =>
        option.setName('state')
            .setDescription('True - open; False - closed')
            .setRequired(true)
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

    const regState = interaction.options.getBoolean('state');
    
    const activeEvent = await EventModel.findByIdAndUpdate(
        activeEventTag,
        { registrationsState: regState },
        { returnDocument: 'after' },
    );

    const stringState = regState ? 'open' : 'closed';
    await interaction.followUp(`Registrations are now ${stringState} for the event ${activeEvent.name}.`);
}