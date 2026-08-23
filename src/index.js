import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

import { loadCommands } from "./utility/loadCommands.js";
import { commandHandler } from "./handlers/commandHandler.js";

const mongoConnectionURL = 'mongodb://localhost/gdgt';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
    console.log(`[INFO] Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

(async () => {
    try {
        const commandsArray = await loadCommands();
        for (let i = 0; i < commandsArray.length; i++) {
            client.commands.set(commandsArray[i].data.name, commandsArray[i]);
        }
        
        mongoose.connect(mongoConnectionURL);

    } catch (error) { console.log(error); }
})();

client.on(Events.InteractionCreate, async (interaction) => {
    await commandHandler(interaction);
});

client.login(process.env.DISCORD_BOT_TOKEN);