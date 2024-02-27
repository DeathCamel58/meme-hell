export interface BotConfig {
  prefix: string;
  botToken: string;
  webPort: number;

  // Below are options for scripts
  renameAll: {
    enable: boolean;
    ms: number;
    adjectives: string[];
    nouns: string[];
  }

  roleJuggler: {
    enable: boolean;
    ms: number;
    roleNames: string[];
    roleIcons: string[];
  }

  channelJuggler: {
    enable: boolean;
    ms: number;
  }

  soundEffects: {
    enable: boolean;
    ms: number;
    list: string[];
  }
}
