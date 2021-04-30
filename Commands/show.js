const Discord = require("discord.js");
const config = require("../config.json");
const moment = require("moment");
const { stripIndent } = require("common-tags");
const { timestamp } = require("../Data/Data.json");
const Backup = new (require("../main"))(new Discord.Client(), {
  config: config,
  discord: Discord,
});

exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
    .setAuthor("Server Statistic")
    .setColor("RANDOM")
    .addField(
      "Stats: ",
      `\`\`\`${stripIndent`
    World Created Count: ${Backup.get_all_files(config.world_folder).length}
    World Size: ${Backup.get_total_size(config.world_folder)}
    Player Registered Count: ${
      Backup.get_all_files(config.player_folder).length
    }
    Player Size: ${Backup.get_total_size(config.player_folder)}
    `}\`\`\``
    )
    .setFooter(
      `Last Backup: ${moment.utc(timestamp).format("lll")} ( UTC-Time )`
    );
  return message.channel.send(embed);
};
