import botConfig from '../globals/botConfig';
import {BufferResolvable, ColorResolvable} from "discord.js";
import client from "../globals/discordClient";
import path from "path";
import * as fs from "fs";

const roleJugglerTimer = {
  name: 'roleJuggler',
  ms: botConfig.roleJuggler.ms,
  async execute(args: string[]): Promise<void> {
    if (botConfig.roleJuggler.enable) {
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
            const newRoleName = botConfig.roleJuggler.roleNames[Math.floor(Math.random() * botConfig.roleJuggler.roleNames.length)];
            const randomColor = getRandomColor();
            const randomIconBuffer = await getRandomIcon();

            role
              .edit({
                name: newRoleName,
                color: randomColor,
                icon: randomIconBuffer,
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

async function getRandomIcon(): Promise<BufferResolvable> {
  const iconPath = botConfig.roleJuggler.roleIcons[Math.floor(Math.random() * botConfig.roleJuggler.roleIcons.length)];
  const iconBuffer = await fs.promises.readFile(path.join(__dirname, '../../assets/role-icons', iconPath));
  return iconBuffer;
}
