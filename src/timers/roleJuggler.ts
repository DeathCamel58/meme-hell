import botConfig from '../globals/botConfig';
import {ColorResolvable, Guild, Role} from "discord.js";
import client from "../globals/discordClient";

const roleJugglerTimer = {
  name: 'roleJuggler',
  ms: 20000,
  execute(args: string[]): void {
    if (botConfig.enableRoleJuggler) {
      try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID!)!;

        // Check if the guild is available
        if (!guild) {
          console.error(`Guild not found.`);
          return;
        }

        // Get the bot's highest position role
        const botRolePosition = guild.members.me!.roles.highest.position;

        let roles = guild.roles.cache;
        for (const role of roles.values()) {
          // Check if this role can be edited
          if (botRolePosition > role.position) {
            const oldRoleName = role.name;
            const newRoleName = botConfig.roleNames[Math.floor(Math.random() * botConfig.roleNames.length)];
            const randomColor = getRandomColor();

            role
              .edit({
                name: newRoleName,
                color: randomColor,
              })
              .then(() => console.log(`Renamed role ${oldRoleName} to ${newRoleName}`))
              .catch((error) => console.error(`Error juggling role name ${oldRoleName} to ${newRoleName}`));
          }
        }
      } catch (error) {
        console.error(`roleJuggler error: ${error}`);
      }
    }
  },
};

export = roleJugglerTimer;

const getRandomColor = (): ColorResolvable => {
  return Math.floor(Math.random() * 0xFFFFFF);
};
