import { join } from 'path';
import { readdirSync } from 'fs';
import { Timer } from './interfaces/Timer';
import { Collection } from "discord.js";
import client from "./globals/discordClient";

export class TimerHandler {
  private timers: Collection<string, Timer>;

  constructor(timersPath: string) {
    this.timers = new Collection();

    // Load all event files
    const timerFiles = readdirSync(timersPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of timerFiles) {
      const timer: Timer = require(join(timersPath, file));

      if (!timer.name) {
        console.error(`Timer in file ${file} is missing a 'name' property.`);
        continue;
      }

      if (!timer.ms) {
        console.error(`Timer in file ${file} is missing a 'ms' property.`);
        continue;
      }
      console.log(`Timer: Scheduled ${timer.name} every ${timer.ms}ms`);

      this.timers.set(timer.name, timer);
    }
  }

  init(): void {
    for (const [eventName, timer] of this.timers.entries()) {
      client.on('ready', (...args) => {
        setInterval(() => {
          timer.execute(...args)
        }, timer.ms)
      });
    }
  }
}
