import {GuildMember, Message, PermissionsBitField} from 'discord.js';
import client from "../globals/discordClient";
import botConfig from "../globals/botConfig";

const renameAll = {
  name: 'renameall',
  execute(message: Message, args: string[]): void {
    console.log('Executing renameall command!');

    // Check if the command sender has the necessary permissions
    if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
      message.reply('You do not have the necessary permissions to use this command.');
      return;
    }

    // Rename
    rename();
  },
  executeManual(): void {
    rename();
  }
};

export = renameAll;

function rename() {
  const guild = client.guilds.cache.get(process.env.GUILD_ID!)!;

  // Fetch all members in the server
  guild.members.fetch().then((members) => {
    members.forEach((member: GuildMember) => {
      // Check if the user is online (status is not 'offline')
      if (member.presence?.status !== 'offline') {
        // Generate a random username
        const randomUsername = generateRandomUsername();
        const oldUsername = member.displayName;

        // Rename the member
        member.setNickname(randomUsername)
          .then(() => console.log(`Renamed ${oldUsername} to ${randomUsername}`))
          .catch((error) => console.error(`Error renaming ${oldUsername}: ${error.message}`));
      }
    });
  });
}

// Function to generate a random username
const generateRandomUsername = (): string => {
  const adjectives = botConfig.adjectives;
  const nouns = botConfig.nouns;

  // Randomly decide whether to capitalize the first letter
  const capitalizeFirstLetter = Math.random() < 0.5;

  const randomAdjective = capitalizeFirstLetter ? capitalize(adjectives[Math.floor(Math.random() * adjectives.length)]) : adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = capitalizeFirstLetter ? capitalize(nouns[Math.floor(Math.random() * nouns.length)]) : nouns[Math.floor(Math.random() * nouns.length)];

  // Randomly decide whether to add a random number
  const addRandomNumber = Math.random() < 0.5;
  const randomSuffix = addRandomNumber ? `-${Math.floor(Math.random() * 100)}` : '';

  return `${randomAdjective}${randomNoun}${randomSuffix}`;
};

// Function to capitalize the first letter of a string
const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
