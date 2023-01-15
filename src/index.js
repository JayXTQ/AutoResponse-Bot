require("dotenv").config();
const token = process.env.TOKEN;

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const YAML = require("yaml");
const config = fs.readFileSync("./config.yml", "utf8");

const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits
const client = new Client({ intents: [Guilds, GuildMessages, MessageContent] });
client.commands = new Collection();
client.commandArray = [];
client.config = YAML.parse(config);

const functionFolders = fs.readdirSync(`${__dirname}/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`${__dirname}/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);
