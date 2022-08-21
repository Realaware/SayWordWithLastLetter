import BotClient from "../client";
import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";

interface InteractionCommand<T> {
  name: string;
  description?: string;
  run: (client: BotClient, interaction: T, args: string[]) => void;
}

interface DefaultCommand<T> {
  name: string;
  description?: string;
  run: (client: BotClient, message: T, args: string[]) => void;
  group?: string[];
  validation?: () => boolean;
}

export default DefaultCommand;
export { DefaultCommand, InteractionCommand };
