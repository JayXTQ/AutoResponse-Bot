const fs = require("fs");

module.exports = (client) => {
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync(`${process.cwd()}/src/events`);
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`${process.cwd()}/src/events/${folder}`)
        .filter((file) => file.endsWith(".js"));
      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            const event = require(`${process.cwd()}/src/events/${folder}/${file}`);
            if (event.once)
              client.once(event.name, (...args) =>
                event.execute(...args, client)
              );
            else
              client.on(event.name, (...args) =>
                event.execute(...args, client)
              );
          }
          break;

        default:
          break;
      }
    }
  };
};
