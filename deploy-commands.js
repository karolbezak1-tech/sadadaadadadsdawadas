const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('weryfikacja-panel')
        .setDescription('Wysyła panel weryfikacyjny (tylko dla administracji) '),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Rejestrowanie komend...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('Komendy zarejestrowane pomyślnie!');
    } catch (error) {
        console.error(error);
    }
})();
