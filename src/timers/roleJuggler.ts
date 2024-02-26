import botConfig from '../globals/botConfig';
import {ColorResolvable, Guild, Role} from "discord.js";
import client from "../globals/discordClient";

const roleJugglerTimer = {
  name: 'roleJuggler',
  ms: 60000,
  execute(args: string[]): void {
    if (botConfig.enableRoleJuggler) {
      try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID!)!;

        // Check if the guild is available
        if (!guild) {
          console.error(`Guild not found.`);
          return;
        }

        let roles = guild.roles.cache;

        let ignoredRoles = [
          '@everyone',
          'Disc-Hell',
          'bullybot',
          'Chadmins',
          'Sugandese Doctor',
          'w0w',
          'Our Lord and Savoir Leg',
          'Nig Supreme',
          'AI Overlord',
        ];

        for (const role of roles.values()) {
          if (!ignoredRoles.includes(role.name)) {
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
  const randomColor = Math.floor(Math.random() * 16777215); // 16777215 is FFFFFF in hexadecimal
  return `#${randomColor.toString(16)}`;
};
