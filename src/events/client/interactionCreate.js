module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(
          error +
            "\n\nIf you can not find a solution, please make an issue on the GitHub"
        );
        await interaction.reply({
          content: "Something went wrong!",
        });
      }
    }
  },
};
