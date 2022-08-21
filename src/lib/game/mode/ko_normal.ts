import { TextChannel, User } from "discord.js";
import Game from "..";

export default class KO_NORMAL extends Game {
  mode = "ko_normal"

  constructor(channel: TextChannel, owner: User) {
    super(channel, owner);
  }
}
