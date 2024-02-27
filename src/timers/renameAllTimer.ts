import botConfig from '../globals/botConfig';
import client from "../globals/discordClient";
import {Guild, GuildMember, Role} from "discord.js";

const renameAllTimer = {
  name: 'renameall',
  ms: botConfig.renameAll.ms,
  async execute(args: string[]): Promise<void> {
    if (botConfig.renameAll.enable) {
      try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID!)!;

        // Fetch all members in the server
        guild.members.fetch({withPresences: true}).then(() => {
          guild.members.cache.forEach((member: GuildMember) => {
            // Check if the user is online (status is not 'offline')
            if (member.presence?.status !== 'offline' && member.manageable) {
              // Generate a random username
              const randomUsername = generateRandomUsername();
              const oldUsername = member.displayName;

              // Assign a random role
              const roles = Array.from(guild.roles.cache.values());
              let randomRole = roles[Math.floor(Math.random() * roles.length)];

              // keep picking a random role until we have one we can assign
              while (!canAssignRole(guild, randomRole)) {
                randomRole = roles[Math.floor(Math.random() * roles.length)];
              }

              // Set the random role
              member.roles.set([randomRole])
                .then(() => console.log(`Assigned random role to ${oldUsername}: ${randomRole.name}`))
                .catch((error) => console.error(`Error assigning random role to ${oldUsername}: ${error.message}`));

              // Rename the member
              member.setNickname(randomUsername)
                .then(() => console.log(`Renamed ${oldUsername} to ${randomUsername}`))
                .catch((error) => console.error(`Error renaming ${oldUsername}: ${error.message}`));
            }
          });
        });
      } catch (error) {
        console.error(`renameAll error: ${error}`);
      }
    }
  },
};

export = renameAllTimer;

// Function to generate a random username
const generateRandomUsername = (): string => {
  const adjectives = botConfig.renameAll.adjectives;
  const nouns = botConfig.renameAll.nouns;

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

function canAssignRole(guild: Guild, role: Role) {
  // Get the bot's highest position role
  const botRolePosition = guild.members.me!.roles.highest.position;
  const rolePosition = role.position;

  // Verify that the bot's role is higher than the role to assign
  if (rolePosition >= botRolePosition) {
    return false;
  }

  // Catch roles managed by Discord, as we can't add to these
  if (role.managed) {
    return false;
  }

  return true;
}
