import { ChatInputCommandInteraction, Interaction } from "discord.js";
import Event from "../lib/event";
import { InteractionCommand } from "../lib/command";

export default {
  name: "interactionCreate",
  run: async (client, interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName) as
      | InteractionCommand<ChatInputCommandInteraction>
      | undefined;

    if (!cmd) return;

    cmd.run(client, interaction, []);
  },
} as Event;
