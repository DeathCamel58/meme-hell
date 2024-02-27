import { GatewayIntentBits } from 'discord.js';
import { join } from 'path';
import { CommandHandler } from './CommandHandler';
import { EventHandler } from './EventHandler';
import { startWebServer } from './web';
import botConfig from "./globals/botConfig";
import client from "./globals/discordClient";
import {TimerHandler} from "./TimerHandler";

// Initialize command and event handlers
const commandHandler = new CommandHandler(join(__dirname, 'commands'));
const eventHandler = new EventHandler(join(__dirname, 'events'));
const timerHandler = new TimerHandler(join(__dirname, 'timers'));

// Start web server
startWebServer(botConfig);

// Set up event/command listeners
eventHandler.init();
commandHandler.init();
timerHandler.init();

// Log in to Discord using your bot token
client.login(botConfig.botToken);

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Handle errors
client.on('error', (error) => {
  console.error('Discord.js client error:', error);
});
