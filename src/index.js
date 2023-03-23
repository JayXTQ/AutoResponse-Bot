require('dotenv').config() // Load .env file
const Eris = require('eris'); // Load Eris library (Discord API wrapper)
const Tesseract = require("tesseract.js"); // Load Tesseract.js library (OCR)
const { QuickDB } = require("quick.db"); // Load QuickDB library (Database)
const YAML = require("yaml"); // Load YAML library (YAML parser)
const fs = require("fs"); // Load fs library (Filesystem)
let config = fs.readFileSync("./config.yml", "utf8"); // Read config.yml file
config = YAML.parse(config); // Parse config.yml file

const db = new QuickDB() // Create new QuickDB instance

const client = new Eris(process.env.TOKEN); // Create new Eris client instance with token from .env file

client.on('ready', async () => {
    try {
        await client.createCommand({
            name: 'create',
            type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
            description: 'Creates an autoresponse',
            options: [
                {
                    type: 1,
                    name: 'text',
                    description: 'Creates an autoresponse for a text message',
                    options: [
                        {
                            type: 3,
                            name: 'pickups',
                            description: 'Comma-seperated list of words that will trigger the output',
                            required: true
                        },
                        {
                            type: 3,
                            name: 'output',
                            description: 'What do you want to be said in the output?',
                            required: true
                        },
                        {
                            type: 7,
                            name: 'channel',
                            description: 'What channel do you want this to work in?',
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: 'image',
                    description: 'Creates an autoresponse for an image',
                    options: [
                        {
                            type: 3,
                            name: 'pickups',
                            description: 'Comma-seperated list of words that will trigger the output',
                            required: true
                        },
                        {
                            type: 3,
                            name: 'output',
                            description: 'What do you want to be said in the output?',
                            required: true
                        },
                        {
                            type: 7,
                            name: 'channel',
                            description: 'What channel do you want this to work in?',
                            required: true
                        }
                    ]
                }
            ]
        })
        await client.createCommand({
            name: 'destroy',
            type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
            description: 'Destroys an autoresponse',
            options: [{
                name: 'id',
                type: 4,
                required: true,
                description: 'The ID of the autoresponse you want to destroy',
            }]
        })
        await client.createCommand({
            name: 'list',
            type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
            description: 'Lists all autoresponses',
        })
        await client.createCommand({
            name: 'help',
            type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
            description: 'Help with Autoresponse Bot',
        })
    } catch (error) {
        console.error(error);
    }
    console.log('Ready!');
}); // Log when the bot is ready to use commands

client.on('interactionCreate', async (interaction) => {
    if (interaction instanceof Eris.CommandInteraction) {
        if(interaction.guildID){
            if(interaction.data.name == 'create') {
                let options = interaction.data.options[0].options
                const re = /\s*(?:,|$)\s*/;
                let pickups = options[0].value.split(re)
                let output = options[1].value
                let channel = options[2].value

                await db.push("autoResponseData", {
                    pickups: pickups,
                    output: output,
                    channel: channel,
                    type: interaction.data.options[0].name
                })

                
                let aRDlen = await db.get("autoResponseData");
                aRDlen = aRDlen.length - 1;

                await interaction.createMessage(`Created autoresponse with ID ${aRDlen}`)
            }
            if(interaction.data.name == 'destroy') {
                let id = interaction.data.options[0].value
                let aRD = await db.get("autoResponseData");
                if(!aRD[id]) {
                    await interaction.createMessage({ content: "That ID does not exist, please try again!" });
                    return;
                }
                aRD.splice(id, 1)
                await db.set("autoResponseData", aRD)
                await interaction.createMessage(`Destroyed autoresponse with ID ${id}`)
            }
            if(interaction.data.name == 'list') {
                let aRD = await db.get("autoResponseData");
                let aRDlen = aRD.length
                let fields = []
                for(let i = 0; i < aRDlen; i++) {
                    fields.push({ name:`ID: ${i}`, value:`Pickup: ${aRD[i].pickups.join(", ")}\nOutput: ${aRD[i].output}\nChannel: <#${aRD[i].channel}>\nType: ${aRD[i].type}`, inline:true })
                }
                await interaction.createMessage({
                    embed: {
                        title: "Autoresponses",
                        fields: fields,
                        color: config.color
                    }
                })
            }
            if(interaction.data.name == 'help') {
                await interaction.createMessage({
                    embed: {
                        title: "Help",
                        fields: [
                            { name: "/create", value: "Creates an autoresponse" },
                            { name: "/destroy", value: "Destroys an autoresponse" },
                            { name: "/list", value: "Lists all autoresponses" },
                            { name: "/help", value: "Shows this help message" }
                        ],
                        color: config.color
                    }
                })
            }
        }
    }
}); // Command Handler

client.on('messageCreate', async (message) => {
    const db = new QuickDB()
    const aRD = await db.get("autoResponseData");
    for (const response of aRD) {
        if(message.channel.id != response.channel) return;
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
                            const { data: { text } } = await Tesseract.recognize(url, config.lang);
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
            message.channel.createMessage(response.output)
        }
    }
}); // Autoresponse Handler

function attachIsImage(msgAttach) {
    var url = msgAttach.url;
    return url.indexOf("png", url.length - "png".length) !== -1;
} // Checks if attachment is an image

client.connect(); // Connect to Discord