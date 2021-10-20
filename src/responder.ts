import type { Client, ClientUser, Message } from 'discord.js';

export namespace Responder {
  export function initialize(bot: Client<true>, contentGenerator: () => string): void {
    bot.on('messageCreate', message => sendTweet(bot.user, message, contentGenerator));
  }

  function sendTweet(
    clientUser: ClientUser,
    message: Message,
    contentGenerator: () => string,
  ): void {
    const content = message.content;
    if (content !== clientUser.toString() && content !== `<@!${clientUser.id}>`) return;

    message.channel.send(contentGenerator())
      .catch(console.error);
  }
}
