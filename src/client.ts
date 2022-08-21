import {
  ChatInputCommandInteraction,
  Client,
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
  Message,
} from "discord.js";
import CONSTANTS from "./constants.json";
import Command from "./lib/command";
import Event from "./lib/event";
import * as fs from "fs/promises";
import path from "path";
import CommandBuilder from "./lib/command.builder";
import isSlashModule from "./lib/isSlashModule";

type _ = ChatInputCommandInteraction | Message;

export default class BotClient extends Client {
  config = CONSTANTS;
  public commands: Map<string, Command<_>> = new Map();
  public groups: Map<string, Command<_>> = new Map();
  events: Map<string, Event> = new Map();

  async init() {
    this.login(CONSTANTS.token);
    const rest = new REST({ version: "10" }).setToken(CONSTANTS.token);

    // map commands
    (await fs.readdir(path.join(__dirname, "commands"))).forEach(
      async (file) => {
        const { default: module }: { default: Command<_> } = await import(
          `./commands/${file}`
        );

        if (typeof module !== "object") throw new Error("Unsupported type");
        this.commands.set(module.name, module);

        // ignore slash command.
        if (!("slashData" in module)) {
          module.group &&
            module.group.forEach((v) => this.groups.set(v, module));
        }
      }
    );

    (await fs.readdir(path.join(__dirname, "events"))).forEach(async (file) => {
      const { default: event }: { default: Event } = await import(
        `./events/${file}`
      );

      this.events.set(event.name, event);
      this.on(event.name, event.run.bind(null, this));
    });

    // handle slash command.
    const slashCommands = Array.from(this.commands).reduce(
      (result: RESTPostAPIApplicationCommandsJSONBody[], [_, command]) => {
        if (!isSlashModule(command)) return result;
        const { name, description, slashData } = command;

        // some process which makes slash command works well.
        if (slashData) {
          slashData.setName(name).setDescription(description ?? "there is no desc");
          result.push(slashData.toJSON());
        }

        return result;
      },
      []
    );

    try {
      await rest.put(
        Routes.applicationGuildCommands(
          "873182313943531620",
          "860158883372466188"
        ),
        {
          body: slashCommands,
        }
      );
    } catch (error) {
      console.error(error);
      throw new Error(
        "Unexpected error occured while setting up slash commands."
      );
    }
  }
}
