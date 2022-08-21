import {
  SlashCommandBuilder,
  TextBasedChannel,
  TextChannel,
  User,
} from "discord.js";
import CommandBuilder from "../lib/command.builder";

interface _ {
  new (channel: TextChannel | TextBasedChannel, owner: User): {};
}

export default CommandBuilder({
  slashData: new SlashCommandBuilder().addStringOption((option) =>
    option.setName("type").setDescription("set").setRequired(true)
  ),
  name: "game",
  description:
    "새로운 게임을 생성합니다. 게임 모드 리스트를 보려면 /list를 사용해주세요.",
  run: async (_, interaction) => {
    if (!interaction.channel) return;

    try {
      const GAME_INSTANCE: { default: _ } = await import(
        `../lib/game/mode/${interaction.options.getString("type")}`
      );

      interaction.reply({ content: "게임이 생성되었습니다.", ephemeral: true });

      new GAME_INSTANCE.default(interaction.channel, interaction.user);
    } catch (error) {}
  },
});
