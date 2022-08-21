import { SlashCommandBuilder } from "discord.js";

export default function isSlashModule<T>(
  data: T
): data is T & { slashData?: SlashCommandBuilder } {
  return "slashData" in data;
}
