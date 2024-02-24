import {Message, TextChannel, ThreadChannel, ChannelType, PermissionsBitField} from 'discord.js';

const wipe = {
  name: 'wipe',
  execute(message: Message, args: string[]): void {
    console.log('Executing wipe command!');

    // Check if the command sender has the necessary permissions
    if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      message.reply('You do not have the necessary permissions to use this command.');
      return;
    }

    // Fetch all channels in the server
    message.guild?.channels.fetch().then((channels) => {
      channels.forEach((channel) => {
        if (channel) {
          if (channel.type === ChannelType.GuildText) {
            // Delete all messages in text channels
            const textChannel = channel as TextChannel;
            deleteAllMessages(textChannel);
          } else if (channel.isThread()) {
            // Delete all messages in threads
            const threadChannel = channel as ThreadChannel;
            deleteAllMessages(threadChannel);
          }
        }
      });
    });
  },
};

export = wipe;

// Function to delete all messages in a channel
const deleteAllMessages = async (channel: TextChannel | ThreadChannel): Promise<void> => {
  try {
    const messages = await channel.messages.fetch();
    messages.forEach((msg) => {
      msg.delete().catch((error) => console.error(`Error deleting message: ${error.message}`));
    });
  } catch (error) {
    console.error(`Error fetching messages in channel ${channel.name}: ${error}`);
  }
};
