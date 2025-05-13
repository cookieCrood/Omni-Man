const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, Message, ButtonBuilder, ButtonStyle } = require("discord.js");
const {token} = require("./config.json")
const fs = require('node:fs')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences
	],
});

client.commands = getCommands('./commands');

client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, (interaction) => {

    console.log(`Interaction: ${interaction.customId || interaction} | ran by ${interaction.user.tag} or ${interaction.user.id}`)

    let command = client.commands.get(interaction.commandName);

    try{
        if(interaction.replied) return;
        command.execute({ interaction: interaction, client: client });
    } catch (error) {
        console.error(error);
    }

});

client.on(Events.MessageCreate, (message) => {

    if (message.author.bot) { return }

    message.channel.send('Are you sure?')

})

client.login(token);

function getCommands(dir) {
    let commands = new Collection();
    const commandFiles = getFiles(dir)

    for (const commandFile of commandFiles) {
        const command = require(commandFile);
        commands.set(command.data.name, command)
    }
    return commands;
}

function getFiles(dir) {

    const files = fs.readdirSync(dir, {
        withFileTypes: true
    })
    let commandFiles = [];

    for (const file of files) {
        if(file.isDirectory()) {
            commandFiles = [
                ...commandFiles,
                ...getFiles(`${dir}/${file.name}`)
            ]
        } else if (file.name.endsWith(".js")) {
            commandFiles.push(`${dir}/${file.name}`)
        }
    }
    return commandFiles;
}