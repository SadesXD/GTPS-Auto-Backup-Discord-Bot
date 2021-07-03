const fs = require("fs");
const zip = require("zip-folder");
const path = require("path");
const ms = require("ms");
const { stripIndent } = require("common-tags");
const { MessageEmbed } = require("discord.js");

class Backup {
  constructor(client, options) {
    this.client = client;
    this.options = options;
  }

  backup_file() {
    zip(this.options.config.gtps_folder, "GTPS_Backup.zip", (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  save_data(Timestamp) {
    let Data = JSON.parse(fs.readFileSync("./Data/Data.json"));
    Data.time = Timestamp;
    fs.writeFileSync("./Data/Data.json", JSON.stringify(Data, null, 2));

    let data = require("./Data/Data.json");
    data.times = Timestamp;
  }

  send_backup() {
    setInterval(() => {
      let desc = stripIndent(`
      World Created Count: ${this.get_all_files(this.options.config.world_folder).length}
      World Size: ${this.get_total_size(this.options.config.world_folder)}
      Player Registered Count: ${this.get_all_files(this.options.config.player_folder).length}
      Player Size: ${this.get_total_size(this.options.config.player_folder)}
      `);

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .addField("Server Stats", "```" + desc + "```", true)
        .setTimestamp();

      this.save_data(Date.now());
      this.backup_file();
      setTimeout(() => {
        this.client.channels.cache.get(this.options.config.secret_channels).send({
          embed,
          files: [
            {
              attachment: "./GTPS_Backup.zip",
              name: "Backup-result.zip",
            },
          ],
        });
      }, 60000);
    }, ms(this.options.config.delay));
  }

  /**
   * source: https://coderrocketfuel.com/article/get-the-total-size-of-all-files-in-a-directory-using-node-js
   */
  get_all_files(dir, array_files) {
    let files = fs.readdirSync(dir);

    let arrayFiles = array_files || [];

    files.forEach((file) => {
      if (fs.statSync(dir + "/" + file).isDirectory()) {
        arrayFiles = this.get_all_files(dir + "/" + file, arrayFiles);
      } else {
        arrayFiles.push(path.join(dir, file));
      }
    });

    return arrayFiles;
  }

  convert_bytes(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes == 0) {
      return "0 bytes";
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    if (i == 0) {
      return bytes + " " + sizes[i];
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
  }

  get_total_size(dir) {
    const arrayOfFiles = this.get_all_files(dir);

    let totalSize = 0;

    arrayOfFiles.forEach(function (filePath) {
      totalSize += fs.statSync(filePath).size;
    });

    return this.convert_bytes(totalSize);
  }
}

module.exports = Backup;
