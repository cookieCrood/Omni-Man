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

client.on(Events.MessageCreate, (message) => {

    if (message.author.bot) { return }

    message.channel.send('Are you sure?')

})

client.login(token);
