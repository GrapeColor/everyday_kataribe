"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broadcaster = void 0;
const environments_1 = require("./environments");
const discord_js_1 = require("discord.js");
const node_cron_1 = __importDefault(require("node-cron"));
var Broadcaster;
(function (Broadcaster) {
    function initialize(bot, contentGenerator) {
        cacheTargetChannels(bot);
        node_cron_1.default.schedule(environments_1.RANDOM_POST_TWEET_SCHEDULE, () => broadcast(contentGenerator));
        bot
            .on('channelCreate', channel => addTargetChannel(channel))
            .on('channelDelete', channel => removeTargetChannel(channel))
            .on('channelUpdate', (_, channel) => updateTargetChannel(channel));
    }
    Broadcaster.initialize = initialize;
    const targetChannels = new discord_js_1.Collection();
    function isTargetChannel(channel) {
        return !!(channel instanceof discord_js_1.BaseGuildTextChannel
            && channel.topic
            && /<まいにち語部>/.test(channel.topic));
    }
    function cacheTargetChannels(bot) {
        bot.channels.cache.forEach(channel => {
            if (isTargetChannel(channel))
                targetChannels.set(channel.id, channel);
        });
    }
    function addTargetChannel(channel) {
        if (isTargetChannel(channel))
            targetChannels.set(channel.id, channel);
    }
    function removeTargetChannel(channel) {
        targetChannels.delete(channel.id);
    }
    function updateTargetChannel(channel) {
        if (isTargetChannel(channel))
            targetChannels.set(channel.id, channel);
        else
            removeTargetChannel(channel);
    }
    function broadcast(contentGenerator) {
        Promise.all(targetChannels.map(channel => channel.send(contentGenerator())))
            .catch(console.error);
    }
})(Broadcaster = exports.Broadcaster || (exports.Broadcaster = {}));
