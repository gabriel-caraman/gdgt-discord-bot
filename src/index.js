import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";

import { getCommands } from "./getCommands.js";
import { commandHandler } from "./commandHandler.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
    console.log(`[INFO] Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

(async () => {
    try {
        const commandsArray = await getCommands();
        for (let i = 0; i < commandsArray.length; i++) {
            client.commands.set(commandsArray[i].data.name, commandsArray[i]);
        }
    } catch (error) { console.log(error); }
})();

client.on(Events.InteractionCreate, async (interaction) => {
    await commandHandler(interaction);
});

client.login(process.env.DISCORD_BOT_TOKEN);