const Discord = require("discord.js");
const config = require("../config.json");
const Backup = require("../main.js");
const { http } = require("../index.js")

exports.run = async (client, message, args) => {
    if (config.user_id && message.author.id !== config.user_id) {
        return message.channel.send("You're not be able for using this command !")
    } else if (!config.user_id && !message.member.roles.cache.has(config.role_id)) {
        return message.channel.send(`${message.author} You don't have any role permissions for using this command`);
    }
  
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("RANDOM")
      .setDescription("```Are you sure want to backup your server?```")
      .setTimestamp();
  
    message.channel.send(embed).then((msg) => {
      msg.react("✅");
      msg.react("❎");
  
      let correctFilter = (r, u) => r.emoji.name === "✅" && u.id === message.author.id;
      let wrongFilter = (r, u) => r.emoji.name === "❎" && u.id === message.author.id;
  
      let correctCollect = msg.createReactionCollector(correctFilter, { time: 10000 });
      let wrongCollect = msg.createReactionCollector(wrongFilter, { time: 10000 });
  
      correctCollect
        .on("collect", async (c) => {
          msg.channel.send("Please wait... !");
          Backup.send_backup({ http, msg: message, client })
      })
        .on("end", async (x) => {
          correctCollect.stop();
        });
  
      wrongCollect.on("collect", async (x) => {
        embed.setDescription("Canceled !");
        msg.edit({ embed });
        correctCollect.stop();
      });
    });
};
