import { TextChannel, User } from "discord.js";
import Game from "..";
import phoneticRule from "../../phonetic.rule";
import validateSentence from "../../validateWord";

export default class EN_NORMAL extends Game {
  lang: "en" | "ko" = "en";
  mode = 'en_normal'

  constructor(channel: TextChannel, owner: User) {
    super(channel, owner);
  }
}
