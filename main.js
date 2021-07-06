const fs = require("fs");
const zip = require("zip-folder");
const path = require("path");
const ms = require("ms");
var config = require("./config.json")
const { stripIndent } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const variable = require("./variable")
class Backup {
  constructor(client, options) {
    this.client = client;
    this.options = options;
  }
  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
  infoLog(text)
  {
    console.log("[INFO] " + text)
  }
  warningLog(text)
  {
    console.log("[WARNING] " + text)
  }
  check_requirement() {
    this.infoLog("Checking Folder...")
    if (!config.gtps_folder.slice(-1).includes("/")) config.gtps_folder += "/"
    if (config.world_folder.slice(-1).includes("/")) config.world_folder = config.world_folder.slice(0, -1);
    if (config.player_folder.slice(-1).includes("/")) config.player_folder = config.player_folder.slice(0, -1);
    if (config.gtps_folder.length == 1) config.gtps_folder = ""
    if (!fs.existsSync(config.gtps_folder + config.player_folder)) throw new Error("Players folder not found, Please set config.json correctly")
    this.infoLog("Players Folder Found!")
    if (!fs.existsSync(config.gtps_folder + config.world_folder)) throw new Error ("Worlds folder not found, please set config.json correctly")
    this.infoLog("Worlds folder Found!")
    this.infoLog("Folder has been checked")
    this.infoLog("Checking Config...")
    if (!config.prefix) throw new Error("Please set the prefix at config.json")
    if (!config.token) throw new Error("Please set the token at config.json")
    if (!config.secret_channels) throw new Error("Please set the Secret channel ID at config.json")
    if (isNaN(config.secret_channels)) throw new Error("Secret Channel ID must be Number")
    if (!config.role_id && !config.user_id) throw new Error("Please set Role ID or User ID at config.json")
    if (isNaN(config.role_id)) throw new Error("Role ID must be Number")
    if (isNaN(config.user_id)) throw new Error("User ID must be Number")
    if (!config.delay) throw new Error("Please set the Delay at config.json")
    this.infoLog("Config has been checked")
  }
  check_delay() {
    if (ms(this.options.config.delay) < ms("2m")) {
      throw new Error("Min for delay in your config is 2m");
    }
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
      World Created Count: ${this.get_all_files(this.options.config.gtps_folder + this.options.config.world_folder).length}
      World Size: ${this.get_total_size(this.options.config.gtps_folder + this.options.config.world_folder)}
      Player Registered Count: ${this.get_all_files(this.options.config.gtps_folder + this.options.config.player_folder).length}
      Player Size: ${this.get_total_size(this.options.config.gtps_folder + this.options.config.player_folder)}
      `);

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .addField("Server Stats", "```" + desc + "```", true)
        .setTimestamp();

      this.save_data(Date.now());
      this.backup_file();
      setTimeout(() => {
        if (config.using_http)
        {
          variable.key = this.getRandomString(30)
          this.client.channels.cache.get(this.options.config.secret_channels).send(`Download Backup Link = http://${variable.ip}:7119/GTPS_Backup.zip?keydw=${variable.key}\nExpire Link = ${config.delay}`);
        }
        else {
        this.client.channels.cache.get(this.options.config.secret_channels).send({
          embed,
          files: [
            {
              attachment: "./GTPS_Backup.zip",
              name: "Backup-result.zip",
            },
          ],
        });
      }
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
