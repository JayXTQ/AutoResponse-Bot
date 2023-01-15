const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { QuickDB } = require("quick.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Creates an autoresponse")
        .addStringOption(option =>
            option.setName("pickups")
                .setDescription("Comma-seperated list of words that will trigger the output")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("output")
                .setDescription("What do you want to be said in the output?")
                .setRequired(true)
        )
        .addChannelOption(option => 
            option.setName("channel")
                .setDescription("What channel do you want this to work in?")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction, client) {
        const db = new QuickDB()

        let pickups = interaction.options.getString("pickups");
        const output = interaction.options.getString("output");
        const channel = interaction.options.getChannel("channel");

        pickups = pickups.split(", ")
        let nPickups = [];

        pickups.forEach(pickup => {
            let nPickup;
            nPickup = pickup.split(",")
            for (const nPU of nPickup) {
                nPickups.push(nPU);
            }
        });

        pickups = nPickups;

        await db.push("autoResponseData", {
            pickups: pickups,
            output: output,
            channel: channel
        });

        let aRDlen = await db.get("autoResponseData");
        aRDlen = aRDlen.length - 1;

        await interaction.reply({ content: `I have created an auto-response with the ID of ${aRDlen}, you can use this to delete the auto-response in the future!` });
    }
}