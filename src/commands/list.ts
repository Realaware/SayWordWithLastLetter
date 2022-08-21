import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import CommandBuilder from "../lib/command.builder";
import getGameModeList from "../lib/game/getGameModeList";

export default CommandBuilder({
  name: "list",
  description: "show game list",
  slashData: new SlashCommandBuilder(),
  run: async (client, interaction) => {
    const list = await getGameModeList();
    const embed = new EmbedBuilder().setTitle("게임 모드 리스트").addFields(
      list.map((mode, idx) => ({
        inline: true,
        name: `${idx + 1}.`,
        value: mode.split(".js")[0],
      }))
    );

    await interaction.reply({ embeds: [embed] });
  },
});
