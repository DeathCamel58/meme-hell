import { Client, Message } from 'discord.js';
import { Event } from '../interfaces/Event';

const event: Event = {
  scriptName: 'logMessage',
  eventName: 'messageCreate',
  execute(message: Message, client: Client): void {
    // Your event logic here
    console.log(`Received message: ${message.content}`);
  },
};

export = event;
