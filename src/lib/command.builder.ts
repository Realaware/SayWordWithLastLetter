import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import BotClient from "../client";
import { DefaultCommand, InteractionCommand } from "./command";

export default function CommandBuilder<
  T extends unknown,
  L extends T extends
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    ? InteractionCommand<ChatInputCommandInteraction>
    : DefaultCommand<Message>
>(data: { slashData?: T } & L) {
  return data;
}
