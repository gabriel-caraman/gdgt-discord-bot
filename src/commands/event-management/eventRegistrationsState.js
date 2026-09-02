import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { LoadActiveEvent } from "../../utility/loadActiveEvent.js";
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

    const event = await LoadActiveEvent(interaction.guild.id);
    if (!event) {
        await interaction.followUp(`No active event set for the guild ${interaction.guild.name}.`);
        return;
    }

    if (event.archiveState) {
        await interaction.followUp(`The event ${event.name} is archived.`);
        return;
    }

    const regState = interaction.options.getBoolean('state');
    event.registrationsState = regState;

    await event.save();
    const stateString = regState ? 'open' : 'closed';
    await interaction.followUp(`Registrations are now ${stateString} for the event ${event.name}.`);
}