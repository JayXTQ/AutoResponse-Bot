const { QuickDB } = require("quick.db");
const Tesseract = require("tesseract.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    const db = new QuickDB()
    const aRD = await db.get("autoResponseData");
    for (const response of aRD) {
      if(message.channelId != response.channel.id) return;
      let howmanyin = 0;
      let messagesent = false;
      switch(response.type){
        case "text":
          for (const pickup of response.pickups) {
            if(message.content.toLowerCase().includes(pickup.toLowerCase())) howmanyin++;
          }
        case "image":
          if(message.attachments.size > 0){
            if (message.attachments.every(attachIsImage)){
              for (const { url } of message.attachments.toJSON()){
                const { data: { text } } = await Tesseract.recognize(url, client.config.lang);
                for (const pickup of response.pickups) {
                  if(howmanyin === (response.pickups.length)) break;
                  if(text.toLowerCase().includes(pickup.toLowerCase())) howmanyin++;
                }
              }
            }
          }
      }
      if(howmanyin === (response.pickups.length) && !messagesent) {
        messagesent = true;
        message.channel.send(response.output)
      }
    }
  },
};

function attachIsImage(msgAttach) {
  var url = msgAttach.url;
  return url.indexOf("png", url.length - "png".length) !== -1;
}
