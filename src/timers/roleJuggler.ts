import botConfig from '../globals/botConfig';
import {ColorResolvable, Guild, Role} from "discord.js";
import client from "../globals/discordClient";

const roleJugglerTimer = {
  name: 'roleJuggler',
  ms: 60000,
  execute(args: string[]): void {
    if (botConfig.enableRoleJuggler) {
      const guild = client.guilds.cache.get(process.env.GUILD_ID!)!;

      // Check if the guild is available
      if (!guild) {
        console.error(`Guild not found.`);
        return;
      }

      let roles = guild.roles.cache;

      let roleNames: string[] = [];

      for (const role of roles.values()) {
        if (role.name !== '@everyone' && role.name !== 'Disc-Hell') {
          roleNames.push(role.name);
        }
      }

      // Shuffle the order of names
      shuffle(roleNames);

      for (const role of roles.values()) {
        if (role.name !== '@everyone' && role.name !== 'Disc-Hell') {
          const oldRoleName = role.name;
          const newRoleName = roleNames[0];
          const randomColor = getRandomColor();

          // Change the name of the current role to roleNames index 0
          role
            .edit({
              name: newRoleName,
              color: randomColor,
            })
            .then(() => console.log(`Renamed role ${oldRoleName} to ${newRoleName}`))
            .catch((error) => console.error(`Error juggling role name ${oldRoleName} to ${newRoleName}`));

          // Remove first from array
          roleNames.shift();
        }
      }
    }
  },
};

export = roleJugglerTimer;

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomColor = (): ColorResolvable => {
  const randomColor = Math.floor(Math.random() * 16777215); // 16777215 is FFFFFF in hexadecimal
  return `#${randomColor.toString(16)}`;
};
