const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Creates an autoresponse"),
    async execute(interaction, client) {

    }
}