import CommandBuilder from "../lib/command.builder";

export default CommandBuilder({
  name: "kick",
  description: "kick .",
  run: (client, msg) => {
    msg.channel.send("nothing.");
  },
});
