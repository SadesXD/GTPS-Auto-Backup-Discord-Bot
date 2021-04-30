const Discord = require("discord.js");
const config = require("../config.json");
const Backup = new (require("../main.js"))(new Discord.Client(), {
  discord: Discord,
  config: config,
});
const reply = require("../Data/Data.json");
const { stripIndent } = require("common-tags");

module.exports = {
  run: async (client, message, args) => {
    // If user doesn't have specified role (role id in config.json file), so the user can't use this command
    if (!message.member.roles.cache.has(config.role_id)) {
      return message.channel.send("You don't have any role permission !");
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("RANDOM")
      .setDescription(
        `\`\`\`${stripIndent`
        Are you sure want to backup on this channel?
        ---
        You must be sure that you will back up the server on this channel | be careful of other people who will take your files
        ---
        Type ( yes | y ) if you want | Type (no | n) if you don't want
        `}\`\`\``
      )
      .setTimestamp();

    let result_msg = await message.channel.send(embed);
    reply[message.author.id] = 1;
    setTimeout(() => {
      if (!reply[message.author.id]) return;
      embed.setDescription("```Canceled```");
      result_msg.edit(embed);
      delete reply[message.author.id];
    }, 10000);
  },
  send_msg: (message) => {
    if (reply[message.author.id]) {
      let userMsg = message.content.toLowerCase();
      if (userMsg === "yes" || userMsg === "y") {
        let msg = {
          embed: {
            color: "RANDOM",
            fields: [
              {
                name: "Server stats",
                value: `\`\`\`${stripIndent`
                            World Created Count: ${
                              Backup.get_all_files(config.world_folder).length
                            }
                            World Size: ${Backup.get_total_size(
                              config.world_folder
                            )}
                            Player Registered Count: ${
                              Backup.get_all_files(config.player_folder).length
                            }
                            Player Size: ${Backup.get_total_size(
                              config.player_folder
                            )}
                            `}\`\`\``,
                inline: true,
              },
            ],
          },
          files: [
            {
              attachment: "./GTPS_Backup.zip",
              name: "Backup-result.zip",
            },
          ],
        };

        Backup.backup_file();
        Backup.save_data(Date.now());
        message.author
          .send("```Backup Loaded```", msg)
          .then(() => message.channel.send("Check your dm"))
          .catch(() => message.channel.send("```Backup Loaded```", msg));
        delete reply[message.author.id];
      } else if (userMsg === "no" || userMsg === "n") {
        delete reply[message.author.id];
        return message.channel.send("Canceled");
      }
    }
  },
};
