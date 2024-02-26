export interface BotConfig {
  prefix: string;
  botToken: string;
  webPort: number;

  // Below are options in the web UI
  enableRenameAll: boolean;
  adjectives: string[];
  nouns: string[];

  enableRoleJuggler: boolean;
  roleNames: string[];
  enableChannelJuggler: boolean;
  enableSoundEffects: boolean;

  soundEffects: string[];
}
