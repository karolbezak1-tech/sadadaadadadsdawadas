const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    init: (client) => {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'zarob-panel') {
                // 1. Natychmiastowe potwierdzenie interakcji (zapobiega błędom na hostingu)
                await interaction.deferReply({ ephemeral: true });

                // Sprawdzenie uprawnień administratora
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.editReply({ content: 'Brak uprawnień do tej komendy.' });
                }

                try {
                    const embed = new EmbedBuilder()
                        .setTitle('💸 ZGARNIJ DARMOWE 15 PLN NA START!')
                        .setDescription(
                            `Chcesz zarobić łatwe pieniądze lub dostać bonus do swojego zamówienia? Mamy dla Ciebie prostą ofertę w ramach współpracy z **Kakobuy**!\n\n` +
                            `**Jak odebrać bonus?**\n` +
                            `1️⃣ Zarejestruj konto z naszego oficjalnego linku:\n` +
                            `🔗 **https://ikako.vip/r/luckyy**\n\n` +
                            `2️⃣ Opłać swoją pierwszą paczkę (dostawę) za minimum **100 PLN**.\n\n` +
                            `3️⃣ Po opłaceniu paczki zgłoś się do nas po odbiór nagrody!\n\n` +
                            `**Nagroda do wyboru:**\n` +
                            `💰 **10 PLN** przelewem na telefon (BLIK) lub \n` +
                            `📦 **Dowolny przedmiot** z Kakobuy do 15zł\n\n` +
                            `**Gdzie się zgłosić?**\n` +
                            `Otwórz zgłoszenie tutaj: <#1469666233950535742>\n` +
                            `Wybierz kategorię: \`Pomoc\`\n\n` +
                            `⚠️ *Pamiętaj: Każde zgłoszenie jest dokładnie weryfikowane w naszym panelu partnerskim. Próby oszustwa skutkują blokadą na serwerze.*`
                        )
                        .setColor('#FFFFFF')
                        .setImage('https://cdn.discordapp.com/attachments/1469777712028713103/1470022730945659016/image.png?ex=6989c8da&is=6988775a&hm=b4c638606bf55ed28ef0693cc63e49ef1a4b2c5652d80121d522e05ad7eb5351')
                        .setFooter({ text: 'LuckyReps x Kakobuy • Promocja ograniczona czasowo' })
                        .setTimestamp();

                    // Wysłanie właściwego panelu na kanał
                    await interaction.channel.send({ embeds: [embed] });

                    // Finalna odpowiedź dla Ciebie
                    await interaction.editReply({ content: '> **Panel zarobkowy został pomyślnie wysłany!**' });

                } catch (error) {
                    console.error('Błąd w module zarobkowym:', error);
                    if (interaction.deferred) {
                        await interaction.editReply({ content: 'Wystąpił błąd podczas wysyłania panelu.' });
                    }
                }
            }
        });
    }
};
