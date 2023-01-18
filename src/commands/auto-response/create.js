const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { QuickDB } = require("quick.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Creates an autoresponse")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName("text")
                .setDescription("For creating a text based auto-response")
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
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("image")
                .setDescription("For creating an image based auto-response")
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
        ),
    async execute(interaction, client) {
        if(!interaction.options.getSubcommand()) return interaction.reply({ "content": "You need to enter a subcommand" })

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
            channel: channel,
            type: interaction.options.getSubcommand()
        });

        let aRDlen = await db.get("autoResponseData");
        aRDlen = aRDlen.length - 1;

        await interaction.reply({ content: `I have created an auto-response with the ID of ${aRDlen}, you can use this to delete the auto-response in the future!` });
    }
}