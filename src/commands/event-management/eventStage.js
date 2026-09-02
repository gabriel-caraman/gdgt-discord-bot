import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { LoadActiveEvent } from "../../utility/loadActiveEvent.js";
import { EventModel } from "../../models/eventModel.js";

export const data = new SlashCommandBuilder()
    .setName('event-stage')
    .setDescription('Modify a stage for the active event. Set order to 0 to delete the stage.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Name of the stage.')
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('order')
            .setDescription('Order of the stage.')
            .setRequired(true)
            .setMinValue(0)
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

    const queryName = interaction.options.getString('name');
    const queryOrder = interaction.options.getInteger('order');

    // Delete the stage
    if (queryOrder === 0) {
        await event.stages.pull({ stageName: queryName });
        await event.save();

        await interaction.followUp(`Updated the ${queryName} stage from the event ${event.name}.`);
        return;
    }

    // Update the stage (name/order)
    for (let i = 0; i < event.stages.length; i++) {
        if (event.stages[i].stageOrder == queryOrder) {
            await interaction.followUp(`The ${event.stages[i].stageName} stage already occupies this order number.`);
            return;
        }
    }

    for (let i = 0; i < event.stages.length; i++) {
        if (event.stages[i].stageName == queryName) {
            event.stages[i].stageOrder = queryOrder;
            await event.save();

            await interaction.followUp(`Updated the ${event.stages[i].stageName} stage (order: ${event.stages[i].stageOrder}) from the event ${event.name}`);
            return;
        }
    }

    // Add a new stage
    await event.stages.push({
        stageName: queryName,
        stageOrder: queryOrder,
    });
    await event.save();
    await interaction.followUp(`Added the ${queryName} stage to the event ${event.name}.`);
}