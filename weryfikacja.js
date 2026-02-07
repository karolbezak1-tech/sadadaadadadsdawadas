const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    init: (client) => {
        // Twoje ID roli
        const ROLE_ID = '1469658211396091960';

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'weryfikacja-panel') {
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.reply({ content: 'Tylko administrator może to zrobić.', ephemeral: true });
                }

                // --- TUTAJ JEST NOWA, ROZBUDOWANA WIADOMOŚĆ ---
                const embed = new EmbedBuilder()
                    .setTitle('🛡️ WERYFIKACJA DOSTĘPU')
                    .setDescription(
                        `Witamy w oficjalnej społeczności **LuckyReps**! 👋\n\n` +
                        `Jesteś o krok od odblokowania pełnej zawartości serwera. ` +
                        `System weryfikacji został wprowadzony, aby zapewnić bezpieczeństwo i porządek na naszych kanałach.\n\n` +
                        `**Co zyskujesz po weryfikacji?**\n` +
                        `🔓 Pełny dostęp do wszystkich kanałów\n` +
                        `🛒 Dostęp do Linków z tiktoka, promocji, darmowego 15zł  \n` +
                        `💬 Dostęp do czatu ogólnego i ticketów\n\n` +
                        `⬇️ **Kliknij reakcję ✅ poniżej, aby wejść!**`
                    )
                    .setColor('#FFFFFF') // Biały kolor
                    .setImage('https://cdn.discordapp.com/attachments/1469777712028713103/1469778783555813650/image.png?ex=6988e5a9&is=69879429&hm=d1771cb64bd90d69865522eb0bedb44019c43224416de73d233e54688c454081')
                    .setFooter({ text: 'System Weryfikacji | LuckyReps' })
                    .setTimestamp();

                // Ciche potwierdzenie dla Ciebie
                await interaction.reply({ content: '> **Panel został wygenerowany pomyślnie!**', ephemeral: true });

                // Wysłanie panelu na kanał
                const message = await interaction.channel.send({ embeds: [embed] });
                await message.react('✅');
            }
        });

        client.on('messageReactionAdd', async (reaction, user) => {
            if (user.bot) return;

            if (reaction.partial) {
                try {
                    await reaction.fetch();
                } catch (error) {
                    return console.error('Błąd pobierania reakcji:', error);
                }
            }

            if (reaction.emoji.name !== '✅') return;

            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(ROLE_ID);

            if (role && member) {
                try {
                    await member.roles.add(role);
                    console.log(`Pomyślnie zweryfikowano: ${user.tag}`);
                } catch (e) {
                    console.error('Błąd podczas nadawania roli:', e);
                }
            }
        });
    }
};
