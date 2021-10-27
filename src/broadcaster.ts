import { RANDOM_POST_TWEET_SCHEDULE } from './environments';
import { Collection, BaseGuildTextChannel } from 'discord.js';
import cron from 'node-cron';

import type { Snowflake, Client, Channel } from 'discord.js';

export namespace Broadcaster {
  export function initialize(bot: Client<true>, contentGenerator: () => string): void {
    cacheTargetChannels(bot);

    cron.schedule(
      RANDOM_POST_TWEET_SCHEDULE,
      () => broadcast(contentGenerator),
      { timezone: 'Asia/Tokyo' },
    );

    bot
      .on('channelCreate', channel => addTargetChannel(channel))
      .on('channelDelete', channel => removeTargetChannel(channel))
      .on('channelUpdate', (_, channel) => updateTargetChannel(channel));
  }

  interface TargetChannel extends BaseGuildTextChannel {}

  const targetChannels: Collection<Snowflake, TargetChannel> = new Collection();

  function isTargetChannel(channel: Channel): channel is TargetChannel {
    return !!(
      channel instanceof BaseGuildTextChannel
      && channel.topic
      && /<まいにち語部>/.test(channel.topic)
    );
  }

  function cacheTargetChannels(bot: Client): void {
    bot.channels.cache.forEach(channel => {
      if (isTargetChannel(channel)) targetChannels.set(channel.id, channel);
    });
  }

  function addTargetChannel(channel: Channel): void {
    if (isTargetChannel(channel))targetChannels.set(channel.id, channel);
  }

  function removeTargetChannel(channel: Channel): void {
    targetChannels.delete(channel.id);
  }

  function updateTargetChannel(channel: Channel): void {
    if (isTargetChannel(channel))
      targetChannels.set(channel.id, channel);
    else
      removeTargetChannel(channel);
  }

  function broadcast(contentGenerator: () => string): void {
    Promise.all(
      targetChannels.map(channel => channel.send(contentGenerator()))
    )
      .catch(console.error);
  }
}
