const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// --- WEBSERVER DLA UPTIME ROBOT ---
const app = express();
app.get('/', (req, res) => res.send('Bot is Online!'));
app.listen(process.env.PORT || 8080, () => console.log('Webserver ready.'));

// --- IMPORT MODUŁU WERYFIKACJI ---
const verification = require('./weryfikacja.js');
verification.init(client);

client.once('ready', async () => {
    console.log(`Zalogowano jako ${client.user.tag}`);
    
    // Rejestracja komendy /weryfikacja-panel
    const guildId = process.env.GUILD_ID; // Opcjonalnie ID Twojego serwera dla szybkiej synchronizacji
    const guild = client.guilds.cache.get(guildId);
    const commands = guild ? guild.commands : client.application.commands;

    await commands.create({
        name: 'weryfikacja-panel',
        description: 'Wysyła Panel do weryfikacji (tylko dla administracji)',
    });
});

client.login(process.env.DISCORD_TOKEN);
