const { QuickDB } = require("quick.db");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    const db = new QuickDB()
    const aRD = await db.get("autoResponseData");
    for (const response of aRD) {
      if(message.channelId != response.channel.id) return;
      let howmanyin = 0;
      for (const pickup of response.pickups) {
        if(message.content.includes(pickup)) howmanyin++;
      }
      if(howmanyin === (response.pickups.length)) message.channel.send(response.output)
    }
  },
};
