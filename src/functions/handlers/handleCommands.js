const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync(`${process.cwd()}/src/commands`);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`${process.cwd()}/src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`${process.cwd()}/src/commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      }
    }

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    try {
      await rest.put(Routes.applicationCommands(client.config.id), {
        body: client.commandArray,
      });
    } catch (error) {
      console.error(
        error +
          "\n\nIf you can not find a solution, please make an issue on the GitHub"
      );
    }
  };
};
