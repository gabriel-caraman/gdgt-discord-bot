import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import { WhitelistCheck } from "../../utility/whitelistCheck.js";
import { ActiveEventCheck } from "../../utility/activeEventCheck.js";
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

    const activeEventTag = await ActiveEventCheck(interaction.guild.id);
    if (!activeEventTag) {
        await interaction.followUp('No active event set for this server.');
        return;
    }

    const activeEvent = await EventModel.findById(activeEventTag);
    const query = {
        stageName: interaction.options.getString('name'),
        stageOrder: interaction.options.getInteger('order'),
    }
    
    // Delete the stage
    if (query.stageOrder == 0) {
        await activeEvent.stages.pull({ stageName: query.stageName });
        await activeEvent.save();

        await interaction.followUp(`Updated the ${query.stageName} stage from the event ${activeEvent.name}.`);
        return;
    }

    // Update the stage (name/order)
    for (let i = 0; i < activeEvent.stages.length; i++) {
        if (activeEvent.stages[i].stageOrder == query.stageOrder) {
            await interaction.followUp(`The ${activeEvent.stages[i].stageName} stage already occupies this order number.`);
            return;
        }
    }

    for (let i = 0; i < activeEvent.stages.length; i++) {
        if (activeEvent.stages[i].stageName == query.stageName) {
            activeEvent.stages[i].stageOrder = query.stageOrder;
            
            await activeEvent.save();
            await interaction.followUp(`Updated the ${activeEvent.stages[i].stageName} stage from the event ${activeEvent.name}.`);
            return;
        }
    }

    // Add a new stage
    const a = await activeEvent.stages.push({
        stageName: query.stageName,
        stageOrder: query.stageOrder,
    });
    console.log(a);

    await activeEvent.save();
    await interaction.followUp(`Added the ${query.stageName} stage to the event ${activeEvent.name}.`);
}