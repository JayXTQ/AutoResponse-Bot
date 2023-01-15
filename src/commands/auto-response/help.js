const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Help with AutoResponse-Bot")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle("Help!")
            .setFields(
                { name: "help", value: "Shows this help message" },
                { name: "create", value: "Makes an auto-response" },
                { name: "destroy", value: "Destroys an auto-response" },
                { name: "list", value: "List all auto-responses" }
            )

        await interaction.reply({ embeds: [embed] });
    }
}