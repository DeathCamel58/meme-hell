import {BotConfig} from "../interfaces/BotConfig";

// Load environment variables from .env file
import { config } from 'dotenv';
import * as fs from "fs";
import path from "path";
config();

/**
 * Reads in all lines from a file path, and returns them as an array
 * @param filePath The file to read
 */
function getArray(filePath: string) {
  const fileContent = fs.readFileSync(path.join(__dirname, filePath), 'utf-8');
  return fileContent.split('\n');
}

const botConfig: BotConfig = {
  prefix: process.env.PREFIX || '!',
  botToken: process.env.BOT_TOKEN || '',
  webPort: parseInt(process.env.WEB_PORT || '3000', 10),

  // Configurable options
  enableRenameAll: false,
  adjectives: getArray('../../assets/adjectives.txt'),
  nouns: getArray('../../assets/nouns.txt'),

  enableRoleJuggler: false,
  enableChannelJuggler: false,
};
export default botConfig;
