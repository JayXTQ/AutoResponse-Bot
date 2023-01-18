const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { QuickDB } = require("quick.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list")
        .setDescription("List all auto responses")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction, client) {
        const db = new QuickDB()

        let aRD = await db.get("autoResponseData");

        if(aRD === null || !aRD) {
            await db.set("autoResponseData", [])
            aRD = await db.get("autoResponseData");
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle("List of Auto-Responses")
        
        for (const response of aRD) {
            const index = aRD.indexOf(response);
            embed.addFields({ name: `ID ${index}`, value: `Channel: <#${response.channel.id}>\nPickup values: ${response.pickups.join(", ")}\nType: ${response.type}`, inline: true })
        }

        await interaction.reply({ embeds: [embed] });
    }
}