const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    init: (client) => {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'strona-panel') {
                // deferReply sprawia, że admin nie widzi "użył komendy" w ostatecznej wiadomości
                await interaction.deferReply({ ephemeral: true });

                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.editReply({ content: 'Brak uprawnień.' });
                }

                const embed = new EmbedBuilder()
                    .setTitle('🌐 OFICJALNA STRONA LUCKYREPS (START WKRÓTCE) ')
                    .setDescription(
                        `Z radością ogłaszamy, że nasz projekt posiada własną platformę internetową, która ułatwi Ci życie w świecie repsów!\n\n` +
                        `🚀 **Co znajdziesz na stronie?**\n` +
                        `* 🛰️ **Tracking paczek** – śledź swoje haul'e w jednym miejscu.\n` +
                        `* 🔗 **Konwerter linków** – zamieniaj linki z TaoBao/weidian na linki z kakobuy\n` +
                        `* 📸 **Sprawdzanie QC** – szybki podgląd zdjęć Twoich przedmiotów.\n` +
                        `* 📊 **Spreadsheet** – nasza baza najlepszych znalezisk.\n\n` +
                        `🔗 **Link do strony:** https://luckyreps.github.io/luckyrepsproject/ \n\n` +
                        `**Dlaczego warto?**\n` +
                        `Zamiast skakać po różnych serwisach, masz wszystkie niezbędne narzędzia w jednym miejscu. Bardzo ciężko pracujemy nad rozwojem tej witryny, aby była jak najbardziej intuicyjna.\n\n` +
                        `💬 **Masz opinię lub pomysł?**\n` +
                        `Twoje zdanie jest dla nas kluczowe! Jeśli chcesz nam coś zasugerować, **stwórz ticket w kategorii "Inne"**.`
                    )
                    .setColor('#FFFFFF')
                    .setThumbnail('https://cdn.discordapp.com/attachments/1469777712028713103/1470394353544331397/R.png?ex=698b22f4&is=6989d174&hm=5bef1b49e229d0ea1163075d5417bcc2028f5692c8e7b314e629fcb4c377109f')
                    .setFooter({ text: 'LuckyReps • Tworzone z pasją' })
                    .setTimestamp();

                try {
                    await interaction.channel.send({ embeds: [embed] });
                    await interaction.editReply({ content: 'Panel strony został wysłany!' });
                } catch (error) {
                    console.error('Błąd wysyłania panelu strony:', error);
                    await interaction.editReply({ content: 'Wystąpił błąd.' });
                }
            }
        });
    }
};
