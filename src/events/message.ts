import Event from "../lib/event";
import { Message } from "discord.js";
import isSlashModule from "../lib/isSlashModule";

export default {
  name: "messageCreate",
  run: async (client, message: Message) => {
    if (message.author.bot || !message.content.startsWith(client.config.prefix))
      return;

    const args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);

    const cmd = args.shift()?.toLowerCase();
    if (!cmd) return;
    const command = client.commands.get(cmd);

    if (!command) return;

    if (
      (command.group &&
        command.group.includes("fixed") &&
        !client.config.fixer.includes(message.author.id)) ||
      isSlashModule(command)
    ) {
      return;
    }

    command.run(client, message, args);
  },
} as Event;
