const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    init: (client) => {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'csp-panel') {
                // Natychmiastowe potwierdzenie, żeby nie było błędu "Unknown Interaction"
                await interaction.deferReply({ ephemeral: true });

                // Sprawdzenie uprawnień administratora
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.editReply({ content: 'Brak uprawnień do tej komendy.' });
                }

                const embed = new EmbedBuilder()
                    .setTitle('📦 CZYM NAJLEPIEJ SHIPOWAĆ PACZKI?')
                    .setDescription(
                        `Wybór odpowiedniej linii to klucz do bezpiecznego i taniego otrzymania Twojego haulu. Oto nasz ranking:\n\n` +
                        `🥇 **1. DHL (Small Parcel, Express Line, Duty Free Route & Fast Lines)**\n` +
                        `* **Czas:** Zwykle 13-17 dni.\n` +
                        `* **Dla kogo:** Idealny do większych paczek.\n` +
                        `* **Rada:** Bierzcie najtańszy wariant DHL jaki macie dostępny, bo różnice w czasie są niewielkie.\n\n` +

                        `🥈 **2. ETL (Europe Tariffless Line)**\n` +
                        `* **Czas:** Od 20 do nawet 30 dni.\n` +
                        `* **Dla kogo:** Dla osób szukających oszczędności.\n` +
                        `* **Opis:** Najtańsza opcja, ma mało statusów śledzenia, ale jest w miarę bezpieczna.\n\n` +

                        `🥉 **3. DPD**\n` +
                        `* **Opis:** Bardzo szybka i bezpieczna linia.\n` +
                        `* **Uwaga:** Jest droższa niż pozostałe wymienione wyżej.\n\n` +

                        `---` +
                        `🚫 **CZYM NIE POLECAMY SHIPOWAĆ:**\n\n` +
                        `❌ **UPS** – Wysokie ryzyko cła i podatków. Częste opłaty za magazynowanie i ryzyko przywłaszczenia paczki przez celnika.\n` +
                        `❌ **EMS** – Kompletnie nieopłacalne. Najdroższa linia, niebezpieczna i idzie ok. 21 dni. W tej cenie DHL jest o niebo lepszy.`
                    )
                    .setColor('#FFFFFF')
                    .setImage('https://cdn.discordapp.com/attachments/1469777712028713103/1470382811218444298/img_huoyun.jpg?ex=698b1834&is=6989c6b4&hm=cd731ff811e38e149804ec6ae9f04769582305848d3a1e2c67e26da94569dab7')
                    .setFooter({ text: 'LuckyReps • Wybieraj mądrze!' })
                    .setTimestamp();

                try {
                    // Wysyłamy właściwy embed na kanał
                    await interaction.channel.send({ embeds: [embed] });
                    // Edytujemy cichą odpowiedź dla admina
                    await interaction.editReply({ content: 'Panel "Czym shipować" został wysłany!' });
                } catch (error) {
                    console.error('Błąd wysyłania panelu CSP:', error);
                    await interaction.editReply({ content: 'Wystąpił błąd przy wysyłaniu panelu.' });
                }
            }
        });
    }
};
