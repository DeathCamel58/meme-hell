import botConfig from '../globals/botConfig';
import {TextChannel, VoiceChannel} from 'discord.js';
import client from '../globals/discordClient';

const channelJugglerTimer = {
  name: 'channelJuggler',
  ms: botConfig.channelJuggler.ms,
  execute(args: string[]): void {
    if (botConfig.channelJuggler.enable) {
      try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID!)!;

        // Check if the guild is available
        if (!guild) {
          console.error(`Guild not found.`);
          return;
        }

        let channels = guild.channels.cache;

        let channelNames: string[] = [];

        for (const channel of channels.values()) {
          if (channel instanceof TextChannel || channel instanceof VoiceChannel) {
            channelNames.push(channel.name);
          }
        }

        // Shuffle the order of names
        shuffle(channelNames);

        for (const channel of channels.values()) {
          if (channel instanceof TextChannel || channel instanceof VoiceChannel) {
            const oldChannelName = channel.name;
            const newChannelName = channelNames[0];

            // Change the name of the current channel to channelNames index 0
            channel
              .edit({name: newChannelName})
              .then(() => console.log(`Renamed channel ${oldChannelName} to ${newChannelName}`))
              .catch((error) => console.error(`Error juggling channel name ${oldChannelName} to ${newChannelName}: ${error.message}`));

            // Remove first from array
            channelNames.shift();
          }
        }
      } catch (error) {
        console.error(`channelJuggler error: ${error}`);
      }
    }
  },
};

export = channelJugglerTimer;

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
