const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express');
require('dotenv').config();

// Inicjalizacja klienta bota z pełnym zestawem uprawnień
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,         // Wymagane dla witamy.js
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
    ],
    partials: [
        Partials.Message,
        Partials.Reaction,
        Partials.User
    ]
});

// --- SEKRETY I KONFIGURACJA ---
const TOKEN = process.env.DISCORD_TOKEN;
const PORT = process.env.PORT || 8080;

// --- SERWER WWW DLA UPTIME ROBOT (RENDER) ---
const app = express();
app.get('/', (req, res) => res.status(200).send('Bot Online'));
app.listen(PORT, () => console.log(`[WEB] Nasłuchiwanie na porcie ${PORT}`));

// --- ŁADOWANIE MODUŁÓW (SILNIK BOTA) ---

// 1. Logika Weryfikacji
try {
    require('./weryfikacja.js').init(client);
    console.log('[MODUŁ] Weryfikacja załadowana.');
} catch (error) {
    console.error('[BŁĄD] Moduł weryfikacji:', error);
}

// 2. Status "Streamuje"
try {
    require('./status.js').init(client);
    console.log('[MODUŁ] Status załadowany.');
} catch (error) {
    console.error('[BŁĄD] Moduł statusu:', error);
}

// 3. Regulamin Społeczności
try {
    require('./regulamin.js').init(client);
    console.log('[MODUŁ] Regulamin załadowany.');
} catch (error) {
    console.error('[BŁĄD] Moduł regulaminu:', error);
}

// 4. System Powitań
try {
    require('./witamy.js').init(client);
    console.log('[MODUŁ] System powitań załadowany.');
} catch (error) {
    console.error('[BŁĄD] Moduł powitań:', error);
}

// 5. System Zarabiania (NOWE)
try {
    require('./zarob.js').init(client);
    console.log('[MODUŁ] System zarobkowy załadowany.');
} catch (error) {
    console.error('[BŁĄD] Moduł zarobkowy:', error);
}

// --- EVENTY GŁÓWNE ---
client.once('ready', () => {
    console.log('---------------------------------------');
    console.log(`[BOT] Zalogowano: ${client.user.tag}`);
    console.log(`[BOT] Wszystkie systemy LuckyReps aktywne.`);
    console.log('---------------------------------------');
});

// Zabezpieczenie przed crashowaniem bota
process.on('unhandledRejection', (error) => {
    console.error('[CRITICAL ERROR]:', error);
});

client.login(TOKEN);
