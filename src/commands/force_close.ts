import { SlashCommandBuilder } from "discord.js";
import CommandBuilder from "../lib/command.builder";
import { Games } from "../lib/game";

export default CommandBuilder({
  name: "close",
  description: "testing123",
  run: (client, interaction) => {
    for (const [_, game] of Games) {
      if (
        game.owner &&
        game.owner.id === interaction.options.getUser("user")?.id
      )
        interaction.reply({ content: "targeted game closed", ephemeral: true });
      return game.closeGame();
    }
  },
  slashData: new SlashCommandBuilder().addUserOption((option) =>
    option.setName("user").setDescription("user's game").setRequired(true)
  ),
});

// export default {
//   name: "close",
//   description: "close room forcely",
//   run: async (client, msg, args) => {
//     const mention = msg.mentions.users.first();

//     if (!mention) return;
//   },

//   group: ["fixer"],
// } as Command;
