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

    // 4. Panel Ticketów (NOWE)
    new SlashCommandBuilder()
        .setName('ticket-panel')
        .setDescription('Otwiera centrum pomocy i biletów (Admin)'),

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Rozpoczynanie rejestracji komend slash (Weryfikacja, Regulamin, Zarobek, Tickety)...');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        
        console.log('Sukces! Wszystkie 4 komendy zostały pomyślnie zarejestrowane.');
    } catch (error) {
        console.error('Wystąpił błąd podczas rejestracji komend:', error);
    }
})();
