import { ClientEvents } from "discord.js";
import BotClient from "../client";

export default interface Event {
  name: keyof ClientEvents;
  run: (client: BotClient, ...args: any[]) => void;
}
