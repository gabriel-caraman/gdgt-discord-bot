import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));     // ./src

export async function getCommands() {
    const commands = [];

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandsFiles = fs.readdirSync(commandsPath).filter(
            (file) => file.endsWith('.js')
        );

        for (const file of commandsFiles) {
            const filePath = path.join(commandsPath, file);
            const command = await import(`file://${filePath}`);

            if ('data' in command && 'execute' in command) {
                commands.push(command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a "data" or "execute" property.`);
            }
        }
    }
    return commands;
}