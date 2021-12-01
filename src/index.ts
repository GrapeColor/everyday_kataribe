import {
  ACTIVITY_STREAMING_NAME,
  ACTIVITY_STREAMING_URL,
  EVERYDAY_KATARIBE_TOKEN,
} from './environments';
import { Client, Options } from 'discord.js';
import { Lottery } from './lottery';
import { Broadcaster } from './broadcaster';
import { Replyer } from './replyer';

const bot = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  makeCache: Options.cacheWithLimits({ MessageManager: 0 }),
  presence: {
    activities: [
      { name: ACTIVITY_STREAMING_NAME, type: 'STREAMING', url: ACTIVITY_STREAMING_URL },
    ],
  },
});

bot.once('ready', bot => {
  Lottery.initialize();
  Broadcaster.initialize(bot, Lottery.pickTweetURL);
  Replyer.initialize(bot, Lottery.pickTweetURL);

  console.info('Everyday Kataribe (re)logged in to Discord.');
});

bot.login(EVERYDAY_KATARIBE_TOKEN)
  .catch(console.error);

['SIGTERM', 'SIGINT']
  .forEach(signal => process.on(signal, () => {
    bot.destroy();
    process.exit(0);
  }));
