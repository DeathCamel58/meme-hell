import { Collection, Message } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from "./interfaces/Command";
import client from "./globals/discordClient";

export class CommandHandler {
  private commands: Map<string, Command>;

  constructor(commandsPath: string) {
    this.commands = new Collection();

    // Load all event files
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
      const command: Command = require(join(commandsPath, file));

      if (!command.name) {
        console.error(`Command in file ${file} is missing a 'name' property.`);
        continue;
      }
      console.log(`Command: Added ${command.name}`);

      this.commands.set(command.name, command);
    }
  }

  init(): void {
    client.on('messageCreate', (message) => this.handle(message));
  }

  handle(message: Message): void {
    const args = message.content.slice(process.env.PREFIX?.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName || !this.commands.has(commandName)) return;

    const command = this.commands.get(commandName);

    if (!command) return;

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('An error occurred while executing the command.');
    }
  }
}
