# GTPS Auto Backup Discord Bot

## Description

This project will help you to backup your gtps server using discord bot and without going to vps

## Package required

- common-tags
- cpu-stat
- discord.js
- fs
- moment
- path
- zip-folder

## How to use

- Go to your vps and install this project
- Install Node.js: [https://github.com/GuckTubeYT/GTPSControllerDiscordBot](https://github.com/GuckTubeYT/GTPSControllerDiscordBot)
- Put the app near of your gtps folder
- Setting app in [config.json](#Config) file
- Go to `Setup` folder and click `install.bat` file for install the required package
- If you done installed, Click `start.bat` file in `Setup` folder for start the program

## Config

### Configuration in `config.json` file

- delay: this config must be ends with "s", "m", "h", "d"

  - "s" for seconds, example usage: "1s" -> 1 second
  - "m" for minutes, example usage: "1m" -> 1 minute
  - "h" for hours, example usage: "1h" -> 1 hour
  - "d" for days, example usage: "1d" -> 1 day

```js
{
  "prefix": "", // Your bot prefix command
  "token": "", // Your bot token
  "secret_channels": "", // Discord Channels id, Backup file will auto send into this channel
  "role_id": "", // role id (Discord server role) will you allow for using backup command (Owner role id is recomended)
  "delay": "", // Delay every backup, Backup file will auto send every (this delay config), example usage: "1s", "1m", "1h","1d"
  "world_folder": "Path/to/world_folder/", // Path into your world folder
  "player_folder": "Path/to/player_folder", // Path into your player folder
  "gtps_folder": "Path/to/gtps_folder" // // Path into your gtps folder
}
```

## Notes

- Don't sell this project, because this project is already Open Source (Free to use)
- Don't delete `Data` folder and `all files` in `Data`
  folder
- You can delete `Assets` folder if you don't need that
- Report to [https://github.com/SadesXD/GTPS-Auto-Backup-Discord-Bot/issues](https://github.com/SadesXD/GTPS-Auto-Backup-Discord-Bot/issues) or [Our Discord Server](https://discord.gg/8rUvTYhFqK) if you found some bug

## Credit

- Project inspired by: [GTPSControllerDiscordBot](https://github.com/GuckTubeYT/GTPSControllerDiscordBot)
- Some code: [Here](https://coderrocketfuel.com/article/get-the-total-size-of-all-files-in-a-directory-using-node-js)
