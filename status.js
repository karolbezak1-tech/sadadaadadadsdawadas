const { ActivityType } = require('discord.js');

module.exports = {
    init: (client) => {
        client.once('ready', () => {
            try {
                client.user.setPresence({
                    activities: [{ 
                        name: 'LuckyReps - najlepszy serwer z repami', 
                        type: ActivityType.Streaming,
                        url: 'https://www.twitch.tv/discord' // Wymagane, aby świeciło na fioletowo
                    }],
                    status: 'online',
                });
                console.log('[STATUS] Status "Streamuje" został pomyślnie ustawiony.');
            } catch (error) {
                console.error('[BŁĄD] Nie udało się ustawić statusu:', error);
            }
        });
    }
};
