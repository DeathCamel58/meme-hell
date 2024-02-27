import {BotConfig} from "../interfaces/BotConfig";

// Load environment variables from .env file
import {config} from 'dotenv';
import * as fs from "fs";
import path from "path";

config();

/**
 * Reads in all lines from a file path, and returns them as an array
 * @param filePath The file to read
 */
function getArray(filePath: string) {
  const fileContent = fs.readFileSync(path.join(__dirname, filePath), 'utf-8');
  let data = fileContent.split('\n');

  // Remove the last item to remove the empty line at the end of the file
  data.pop();

  return data;
}

function getFiles(filePath: string) {
  return fs.readdirSync(path.join(__dirname, filePath));
}

const botConfig: BotConfig = {
  prefix: process.env.PREFIX || '!',
  botToken: process.env.BOT_TOKEN || '',
  webPort: parseInt(process.env.WEB_PORT || '3000', 10),

  // Configurable options
  renameAll: {
    enable: false,
    ms: 60000,
    adjectives: getArray('../../assets/adjectives.txt'),
    nouns: getArray('../../assets/nouns.txt'),
  },

  roleJuggler: {
    enable: false,
    ms: 30000,
    roleNames: getArray('../../assets/roles.txt'),
    roleIcons: getFiles('../../assets/role-icons/'),
  },

  channelJuggler: {
    enable: false,
    ms: 60000,
  },

  soundEffects: {
    enable: false,
    ms: 450000,
    list:getArray('../../assets/soundeffects.txt'),
  },
};
export default botConfig;
