const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    // 1. Panel Weryfikacji
    new SlashCommandBuilder()
        .setName('weryfikacja-panel')
        .setDescription('Wysyła panel weryfikacyjny (tylko dla administracji)'),
    
    // 2. Panel Regulaminu
    new SlashCommandBuilder()
        .setName('regulamin-panel')
        .setDescription('Wysyła panel z regulaminem serwera'),

    // 3. Panel Zarobkowy
    new SlashCommandBuilder()
        .setName('zarob-panel')
        .setDescription('Wysyła panel informujący o możliwości zarobku'),

    // 4. Panel Ticketów
    new SlashCommandBuilder()
        .setName('ticket-panel')
        .setDescription('Otwiera centrum pomocy i biletów (Admin)'),

    // 5. Poradnik Wysyłek (NOWE)
    new SlashCommandBuilder()
        .setName('csp-panel')
        .setDescription('Wysyła poradnik o liniach wysyłkowych (Admin)'),

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Rozpoczynanie rejestracji komend slash (Pełna lista: 5 komend)...');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        
        console.log('Sukces! Wszystkie komendy (w tym poradnik wysyłek) zostały zarejestrowane.');
    } catch (error) {
        console.error('Wystąpił błąd podczas rejestracji komend:', error);
    }
})();
