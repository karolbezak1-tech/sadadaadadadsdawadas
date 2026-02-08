const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('weryfikacja-panel')
        .setDescription('Wysyła panel weryfikacyjny (tylko dla administracji)'),
    
    // NOWA KOMENDA REGULAMINU
    new SlashCommandBuilder()
        .setName('regulamin-panel')
        .setDescription('Wysyła rozbudowany panel z regulaminem serwera'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Rozpoczynanie rejestracji komend slash...');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        
        console.log('Sukces! Wszystkie komendy (weryfikacja i regulamin) zostały zarejestrowane.');
    } catch (error) {
        console.error('Wystąpił błąd podczas rejestracji komend:', error);
    }
})();
