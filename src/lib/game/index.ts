import {
  MessageCollector,
  User,
  TextChannel,
  EmbedBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import phoneticRule from "../phonetic.rule";
import validateSentence from "../validateWord";

const Games: Map<number, Game> = new Map();

class Game {
  mode: string = "";
  participants: User[] = [];
  user: User | undefined;
  words: { author: User; word: string }[] = [];
  collector: MessageCollector | undefined;
  timeout: NodeJS.Timeout | undefined;
  playing: boolean = false;
  channel: TextChannel | undefined;
  owner: User | undefined;
  id: number = -1;
  lang: "ko" | "en" = "ko";

  // GAME VARIABLES
  DURATION_BETWEEN_TURN = 10000;

  constructor(channel: TextChannel, owner: User) {
    if (!this.isPlayable(owner)) return;

    this.participants.push(owner);
    this.channel = channel;
    this.owner = owner;
    this.id = Math.floor(Math.random() * 100000000);

    Games.set(this.id, this);

    this.init(channel, owner);
  }

  async init(channel: TextChannel, owner: User) {
    // send game starting announcement.
    const embed = new EmbedBuilder({
      title: "새로운 게임이 생성되었습니다.",
      fields: [
        {
          inline: true,
          name: "게임 모드",
          value: `${this.mode} 모드`,
        },
        {
          inline: false,
          name: "주최자",
          value: owner.username,
        },
      ],
    });

    const msg = await channel.send({
      embeds: [embed],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              style: ButtonStyle.Primary,
              label: "참가하기",
              customId: `gamejoin ${this.id}`,
              type: ComponentType.Button,
            },
          ],
        },
      ],
    });

    const interactionCollector = msg.createMessageComponentCollector({
      filter: (int) =>
        this.isPlayable(int.user) && int.customId === `gamejoin ${this.id}`,
      time: 20000,
      componentType: ComponentType.Button,
    });

    interactionCollector.on("collect", (int) => {
      const joined = this.addUser(int.user);

      int.reply({
        content: joined ? "참가하였습니다." : "참가하는데 실패하였습니다.",
        ephemeral: true,
      });
    });
    interactionCollector.on("end", () => {
      if (this.participants.length === 1) {
        // TODO: remove room.
        this.closeGame();
        return;
      }

      this.playing = true;
      this.startGame();
    });
  }

  public isPlayable(user: User) {
    return (
      !Array.from(Games.values()).some((game) =>
        game.participants.some((_user) => _user.id === user.id)
      ) && !this.participants.some((_user) => _user.id === user.id)
    );
  }

  protected addUser(user: User) {
    if (!this.playing && this.channel) {
      this.participants.push(user);
      this.channel.send(`${user.username} entered`);
      return true;
    }

    return false;
  }

  public closeGame(reason?: string) {
    this.playing = false;
    this.collector && this.collector.stop();
  
    Games.delete(this.id);

    // TODO: .
    const embed = new EmbedBuilder({
      title: "Game Closed",
      description: reason ? `reason: ${reason}` : undefined,
      timestamp: new Date(),
    });

    this.channel?.send({ embeds: [embed] });
  }

  protected async startGame() {
    if (!this.playing) return;

    this.user = this.getRandomUser();
    this.initListener();

    this.channel?.send(`${this.user.username} 님이 첫번째 입니다.`);
  }

  protected getRandomUser() {
    return this.participants[
      Math.floor(Math.random() * this.participants.length)
    ];
  }

  protected getLastCharacter(s: string) {
    return s.split("").pop() as string;
  }

  protected getLastWord(): Game["words"][number] | undefined {
    return this.words[this.words.length - 1];
  }

  protected async validateSentence(q: string) {
    const resp = await validateSentence(q, this.lang);
    const isUsed = this.words.some(({ word }) => word === q);
    const lastWord = this.getLastWord();

    if (!resp) return false;

    if (!lastWord) return true;

    const lastLetter = this.getLastCharacter(lastWord.word);

    return (
      (!isUsed && q.startsWith(lastLetter)) ||
      q.startsWith(phoneticRule[lastLetter as keyof typeof phoneticRule])
    );
  }

  protected nextTurn() {
    if (!this.playing || !this.channel)
      throw new Error("Unexpected function called.");

    const { user, participants } = this;

    const index = participants.findIndex((_user) => _user.id === user?.id);

    if (!(index > -1)) {
      return this.closeGame();
    }

    // case 1: current user is last user of array
    if (index === participants.length - 1) {
      this.user = participants[0];
    } else {
      this.user = participants[index + 1];
    }

    this.channel.send(
      `이번 차레: ${this.user.username}, 제시된 단어의 마지막 글자로 시작하는 단어를 써주세요.`
    );

    // handle user timeout.
    const callback = () => {
      this.closeGame();
      this.channel?.send(
        `${this.user?.username} 적절한 단어를 시간안에 쓰지 못했습니다.`
      );
    };

    this.timeout && clearTimeout(this.timeout);
    this.timeout = setTimeout(callback, this.DURATION_BETWEEN_TURN);
  }

  protected initListener() {
    if (!this.channel) return;

    const collector = this.channel.createMessageCollector({
      time: 6000 * 6000,
      filter: (msg) =>
        msg.author.id === this.user?.id && msg.channelId === this.channel?.id,
      max: 1000 * 1000,
    });

    this.collector = collector;

    collector.on("collect", async (msg): Promise<any> => {
      // wrong word provided
      if (!(await this.validateSentence(msg.content)))
        return this.channel?.send("잘못된 단어입니다, 다시 입력해주세요.");

      this.words.push({
        author: msg.author,
        word: msg.content,
      });
      this.nextTurn();
    });
  }
}

export default Game;

export { Games };
