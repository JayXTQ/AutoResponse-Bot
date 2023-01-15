const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { QuickDB } = require("quick.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("destroy")
        .setDescription("Destroys an autoresponse")
        .addNumberOption(option =>
            option.setName("id")
                .setDescription("ID of the autoresponse you wish to delete")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction, client) {
        const db = new QuickDB()

        const id = interaction.options.getNumber("id");

        let aRD = await db.get("autoResponseData");

        if(!aRD[id]) {
            await interaction.reply({ content: "That ID does not exist, please try again!" });
            return;
        }

        aRD.splice(id, 1);

        await db.set("autoResponseData", aRD);

        await interaction.reply({ content: `I have deleted the auto-response of ${id}` });
    }
}