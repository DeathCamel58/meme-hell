import {VoiceChannel} from 'discord.js';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus
} from '@discordjs/voice';
import {ChannelType} from 'discord-api-types/v10';
import ytdl from 'ytdl-core';
import client from '../globals/discordClient';
import botConfig from "../globals/botConfig";

const soundEffectTimer = {
  name: 'soundEffectTimer',
  ms: 450000,
  execute(args: string[]): void {
    if (botConfig.enableSoundEffects) {
      const guild = client.guilds.cache.get(process.env.GUILD_ID!)!;

      // Check if the guild is available
      if (!guild) {
        console.error(`Guild not found.`);
        return;
      }

      // Find a voice channel with members
      const voiceChannel = guild.channels.cache.find((channel) => channel.type === ChannelType.GuildVoice && (channel as VoiceChannel).members.size > 0) as VoiceChannel | undefined;

      // If a voice channel is found with members
      if (voiceChannel) {
        // Connect to the voice channel
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator!,
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
          try {
            // Play a random sound effect
            const youtubeLinks = botConfig.soundEffects;
            const link = youtubeLinks[Math.floor(Math.random() * youtubeLinks.length)];
            const stream = ytdl(link, {filter: 'audioonly'});
            const resource = createAudioResource(stream);
            const player = createAudioPlayer();

            console.log(`Streaming ${link} to channel`);

            player.play(resource);
            connection.subscribe(player);

            // Leave the voice channel after the sound effect
            player.on(AudioPlayerStatus.Idle, () => {
              connection.destroy();
            })
          } catch (error) {
            console.error(`Error playing sound effect: ${error}`);
            connection.destroy();
          }
        });
      } else {
        console.log('No voice channel with members found. Skipping sound effect.');
      }
    }
  },
};

export = soundEffectTimer;
