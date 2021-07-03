const Discord = require("discord.js");
const config = require("../config.json");
const Backup = new (require("../main.js"))(new Discord.Client(), {
  discord: Discord,
  config: config,
});
const { stripIndent } = require("common-tags");

exports.run = async (client, message, args) => {
  if (!message.member.roles.cache.has(config.role_id)) {
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
          World Created Count: ${Backup.get_all_files(config.world_folder).length}
          World Size: ${Backup.get_total_size(config.world_folder)}
          Player Created Count: ${Backup.get_all_files(config.player_folder).length}
          Player Size: ${Backup.get_total_size(config.player_folder)}
        `);
        message.channel.send("Please wait...");
      
        Backup.backup_file();
        Backup.save_data(Date.now());

        embed.setDescription("```" + dsc + "```");
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
