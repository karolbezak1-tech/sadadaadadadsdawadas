const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express');
require('dotenv').config();

// Inicjalizacja klienta bota z niezbędnymi uprawnieniami
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // Obsługa serwerów
        GatewayIntentBits.GuildMembers,     // Zarządzanie członkami (nadawanie ról)
        GatewayIntentBits.GuildMessageReactions, // Czytanie reakcji ✅
        GatewayIntentBits.GuildMessages,    // Czytanie wiadomości
    ],
    partials: [
        Partials.Message,   // Wymagane, by czytać reakcje pod wiadomościami sprzed restartu
        Partials.Reaction,  // Wymagane do obsługi reakcji
        Partials.User       // Wymagane do poprawnego identyfikowania użytkowników
    ]
});

// --- SEKRETY I KONFIGURACJA ---
const TOKEN = process.env.DISCORD_TOKEN;
const PORT = process.env.PORT || 8080;

// --- SERWER WWW DLA UPTIME ROBOT (RENDER) ---
const app = express();

app.get('/', (req, res) => {
    res.status(200).send('System operacyjny bota: Aktywny');
});

app.listen(PORT, () => {
    console.log(`[WEB] Serwer HTTP nasłuchuje na porcie ${PORT}`);
});

// --- ŁADOWANIE MODUŁÓW ---

// 1. Ładowanie logiki weryfikacji
try {
    const verification = require('./weryfikacja.js');
    verification.init(client);
    console.log('[MODUŁ] Logika weryfikacji została załadowana.');
} catch (error) {
    console.error('[BŁĄD] Nie udało się załadować modułu weryfikacji:', error);
}

// 2. Ładowanie statusu (Streamuje) - NOWE
try {
    const statusModule = require('./status.js');
    statusModule.init(client);
    console.log('[MODUŁ] Status bota został załadowany.');
} catch (error) {
    console.error('[BŁĄD] Nie udało się załadować modułu statusu:', error);
}

// --- EVENTY GŁÓWNE ---
client.once('ready', () => {
    console.log('---------------------------------------');
    console.log(`[BOT] Zalogowano pomyślnie jako: ${client.user.tag}`);
    console.log(`[BOT] Gotowy do działania.`);
    console.log('---------------------------------------');
});

// Obsługa błędów, aby bot nie wyłączył się przy drobnym problemie
process.on('unhandledRejection', error => {
    console.error('[BŁĄD API] Niezidentyfikowany błąd:', error);
});

client.login(TOKEN);
