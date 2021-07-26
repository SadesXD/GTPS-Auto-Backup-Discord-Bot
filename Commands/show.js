const Discord = require("discord.js");
const config = require("../config.json");
const moment = require("moment");
const { stripIndent } = require("common-tags");
const data = require("../Data/data.json");
const { getAllFiles, getTotalSize } = require("../main.js")

exports.run = (client, message, args) => {
    let get_data = data.time;
    get_data = get_data ? `${moment.utc(data.time).format("lll")} (UTC Time)` : "None";
    let dsc = stripIndent(`
    World Created Count: ${getAllFiles(config.gtps_folder + config.world_folder).length}
    World Size: ${getTotalSize(config.gtps_folder + config.world_folder)}
    Player Created Count: ${getAllFiles(config.gtps_folder + config.player_folder).length}
    Player Size: ${getTotalSize(config.gtps_folder + config.player_folder)}
    GTPS Size: ${getTotalSize(config.gtps_folder)}
    `)

    const embed = new Discord.MessageEmbed()
    .setAuthor("Server Statistic")
    .setColor("RANDOM")
    .addField("Stats", "```" + dsc + "```", true)
    .setFooter("Last Backup: " + get_data)

    return message.channel.send(embed);
}
