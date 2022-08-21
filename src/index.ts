import BotClient from "./client";

new BotClient({
  intents: ["Guilds", "GuildMessages", "GuildMessageReactions", 'MessageContent'],
}).init();
