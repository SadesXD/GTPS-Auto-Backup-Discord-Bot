const fs = require("fs");
const zip = require("zip-folder");
const path = require("path");
const ms = require("ms");
const { stripIndent } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const data = require("./Data/Data.json");

class Backup {
  constructor(client, options) {
    this.client = client;
    this.options = options;
  }
  
  getRandomString(length) {
    var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  infoLog(text) {
    console.log("[INFO] " + text);
  }

  check_requirement() {
    const config = this.options.config;
    this.infoLog("Checking folder");
    if (!fs.existsSync(config.gtps_folder)) throw new Error("GTPS folder is not found !")
    else if (!fs.existsSync(config.world_folder)) throw new Error("World folder is not found !");
    else if (!fs.existsSync(config.player_folder)) throw new Error("Player folder is not found !");
    this.infoLog("Folder has been checked !");
    this.infoLog("Checking config !");
    let ListData = Object.keys(config).filter(fil => fil !== "user_id");
    for(let List of ListData) {
      if (!config[List]) throw new Error(`Please set "${List}" at config.json file !`)
    }
    let MustNumber = ["secret_channels", "role_id"];
    for(let mn of MustNumber) {
      if (isNaN(config[mn])) throw new Error(`"${mn}" must be a number`)
    }
    if (ms(config.delay) > ms("2m")) throw new Error("Min for delay in your \"config.json\" file is 2m");
    this.infoLog("All requirement has been checked !");
  }

  check_using_http() {
    if (fs.existsSync("./GTPS_Backup.zip")) {
      let [size, name] = this.convert_bytes(fs.statSync("./GTPS_Backup.zip").size).split(" ");
      if (name === "MB" && parseInt(size) >= 8) {
        this.options.config.using_http = true;
      } else {
        this.options.config.using_http = false
      }
    }
    return this.options.config.using_http;
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

  send_backup(http = null) {
    setInterval(() => {
      let desc = stripIndent(`
      World Created Count: ${this.get_all_files(this.options.config.world_folder).length}
      World Size: ${this.get_total_size(this.options.config.world_folder)}
      Player Registered Count: ${this.get_all_files(this.options.config.player_folder).length}
      Player Size: ${this.get_total_size(this.options.config.player_folder)}
      `);

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .addField("Server Stats", "```" + desc + "```", false)
        .setTimestamp();

      this.save_data(Date.now());
      this.backup_file();
      
      // Give a cooldown/timeout for give more time to bot for zip a folder ( IMPORTANT ! )
      setTimeout(() => {
        if (this.check_using_http()) {
          data.key = this.getRandomString(30);
          http.listening ? null : http.listen(7119);
          
          embed.addField("Backup Link", `[Download Link](http://${data.ip}:7119/GTPS_Backup.zip?keydw=${data.key})`, true)
          embed.addField("Expire Time: ", "```" + this.options.config.delay + "```", true)

          return this.client.channels.cache.get(this.options.config.secret_channels).send(embed);
        } else {
          if (http.listening) http.close();
          return this.client.channels.cache.get(this.options.config.secret_channels)
            .send({
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
