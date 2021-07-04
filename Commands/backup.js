const Discord = require("discord.js");
const config = require("../config.json");
const Backup = new (require("../main.js"))(new Discord.Client(), {
  discord: Discord,
  config: config,
});
const variable = require("../variable")
const fs = require("fs");
const { stripIndent } = require("common-tags");

exports.run = async (client, message, args) => {
  if (!message.member.roles.cache.has(config.role_id) && message.author.id !== config.user_id) {
    console.log(message.author.id)
    return message.channel.send(
      `${message.author} You don't have any role permissions for using this command`
    );
  }

  let desc = stripIndent(`
  Are you sure want to backup on this channel?
  ---
  You must be sure that you will back up the server on this channel | be careful of other people who will take your files
  `);

  const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor("RANDOM")
    .setDescription("```" + desc + "```")
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
        let dsc = stripIndent(`
          World Created Count: ${Backup.get_all_files(config.gtps_folder + config.world_folder).length}
          World Size: ${Backup.get_total_size(config.gtps_folder + config.world_folder)}
          Player Created Count: ${Backup.get_all_files(config.gtps_folder + config.player_folder).length}
          Player Size: ${Backup.get_total_size(config.gtps_folder + config.player_folder)}
        `);
      
        Backup.backup_file();
        Backup.save_data(Date.now());

        message.channel.send("Please wait...");
        embed.setDescription("```" + dsc + "```");
        if (config.using_http) {
          message.author.send(`Download Backup Link = http://127.0.0.1:7119/GTPS_Backup.zip?keydw=${variable.key}\nExpire Link = ${config.delay}`).then((am) => msg.channel.send("Check your dm !"));
        }
        else {
        message.author
          .send({
            embed,
            files: [
              {
                attachment: "./GTPS_Backup.zip",
                name: "Backup-result.zip",
              },
            ],
          })
          .then((am) => {
            msg.channel.send("Check your dm !");
          });
        correctCollect.stop();
        }
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
