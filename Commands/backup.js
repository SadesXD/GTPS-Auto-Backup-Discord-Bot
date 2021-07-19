const Discord = require("discord.js");
const config = require("../config.json");
const Backup = new (require("../main.js"))(new Discord.Client(), {
  discord: Discord,
  config: config,
});
const { stripIndent } = require("common-tags");
const data = require("../Data/Data.json");
const { http } = require("../index.js");
const zip = require("zip-folder");

exports.run = async (client, message, args) => {
  if (!message.member.roles.cache.has(config.role_id) && message.author.id !== config.user_id) {
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
        Backup.save_data(Date.now());

        let dsc = stripIndent(`
          World Created Count: ${Backup.get_all_files(config.gtps_folder + config.world_folder).length}
          World Size: ${Backup.get_total_size(config.gtps_folder + config.world_folder)}
          Player Created Count: ${Backup.get_all_files(config.gtps_folder + config.player_folder).length}
          Player Size: ${Backup.get_total_size(config.gtps_folder + config.player_folder)}
        `);

        embed.setDescription("");
        embed.addField("Server Stats: ", "```" + dsc + "```", false);
        msg.channel.send("Trying to send a file, this process will take a few seconds !");
        zip(config.gtps_folder, "GTPS_Backup.zip", (err) => {
          if (err) console.log(err)
          if (Backup.check_using_http()) {
            let key = Backup.getRandomString(30);
            data.key = key;
            http.listening ? null : http.listen(7119);

            embed.addField(
              "Backup Link",
              `[Download Link](http://${data.ip}:7119/GTPS_Backup.zip?keydw=${data.key})`,
              true
            );
            if (!config.delay.length == 0) embed.addField("Expire Time: ", "```" + config.delay + "```", true);
            
            message.author
              .send(embed)
              .then((am) => message.channel.send("Check your dm !"))
              .catch((err) => {
                return message.channel.send("Looks like you closed your dm :(");
              });
          } else {
            if (http.listening) http.close();

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
