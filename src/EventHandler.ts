import { Client, Collection } from 'discord.js';
import { join } from 'path';
import { readdirSync } from 'fs';
import { Event } from './interfaces/Event';
import client from "./globals/discordClient";

export class EventHandler {
  private events: Collection<string, Event[]>;

  constructor(eventsPath: string) {
    this.events = new Collection();

    // Load all event files
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
      const event: Event = require(join(eventsPath, file));

      if (!event.eventName) {
        console.error(`Event in file ${file} is missing an 'eventName' property.`);
        continue;
      }

      // Check if the eventName already exists in the collection
      if (!this.events.has(event.eventName)) {
        this.events.set(event.eventName, []);
      }

      // Add the event to the array under the eventName
      this.events.get(event.eventName)?.push(event);
      console.log(`Event: Added ${event.scriptName}`);
    }
  }

  init(): void {
    for (const [eventName, eventArray] of this.events.entries()) {
      for (const event of eventArray) {
        client.on(eventName, (...args) => event.execute(...args));
      }
    }
  }
}
