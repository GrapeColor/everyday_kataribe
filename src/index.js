import Discord from 'discord.js';
import cron from 'node-cron';

import { Timeline } from './timeline.js';

Timeline.name = 'KataribeTsumugu';
Timeline.update()
  .catch(console.error);

const sendTweet = channel => {
  const tweet = Timeline.choice();

  channel.send(`https://twitter.com/${Timeline.name}/status/${tweet.id_str}`)
    .catch(console.error);
}

const bot = new Discord.Client({
  ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'] },
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  messageCacheMaxSize: 0
});

const targetRegex = /<まいにち語部>/;
let mentionRegex;
let channels;

bot.once('ready', () => {
  mentionRegex = new RegExp(`^<@!?${bot.user.id}>$`);

  channels
    = bot.channels.cache.filter(channel => targetRegex.test(channel.topic));
});

bot.on('ready', () => {
  console.info('Everyday Kataribe (re)logged in to Discord.');
  bot.user.setPresence({ activity: { type: 'WATCHING',  name: '語部紡' } })
    .catch(console.error);
});

bot.on('channelUpdate', (_, channel) => {
  targetRegex.test(channel.topic)
    ? channels.set(channel.id, channel) : channels.delete(channel.id);
});

bot.on('message', message => {
  if (mentionRegex.test(message.content)) sendTweet(message.channel);
});

bot.setInterval(() => {
  Timeline.update()
    .catch(console.error);
}, 24 * 60 * 60 * 1000);

cron.schedule(
  process.env['TIMELINE_UPDATE_SCHEDULE'],
  () => channels.each(channel => sendTweet(channel)),
  { timezone: 'Asia/Tokyo' }
);

bot.login(process.env['EVERYDAY_KATARIBE_TOKEN'])
  .catch(console.error);
