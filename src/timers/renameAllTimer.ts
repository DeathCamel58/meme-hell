import botConfig from '../globals/botConfig';

const renameAllTimer = {
  name: 'renameall',
  ms: 120000,
  execute(args: string[]): void {
    if (botConfig.enableRenameAll) {
      require('../commands/renameAll').executeManual();
    }
  },
};

export = renameAllTimer;
