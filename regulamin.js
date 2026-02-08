const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    init: (client) => {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'regulamin-panel') {
                // Sprawdzenie uprawnień
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                    return interaction.reply({ content: '> Brak uprawnień.', ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle('📜 REGULAMIN I ZASADY LUCKYREPS')
                    .setDescription(
                        `Wchodząc na serwer i dokonując weryfikacji, automatycznie akceptujesz poniższe warunki. Nieznajomość regulaminu nie zwalnia z jego przestrzegania.\n\n` +
                        
                        `**§1. WYŁĄCZENIE ODPOWIEDZIALNOŚCI (DISCLAIMER)**\n` +
                        `> 1. Serwer LuckyReps ma charakter wyłącznie **edukacyjny, dyskusyjny i kolekcjonerski**.\n` +
                        `> 2. Administracja **nie sprzedaje**, nie magazynuje, nie pośredniczy ani nie czerpie korzyści majątkowych ze sprzedaży przedmiotów naruszających prawa autorskie.\n` +
                        `> 3. Wszelkie linki i dyskusje służą celom informacyjnym ("QC" - Quality Check). Użytkownik dokonuje zakupów na własną odpowiedzialność.\n` +
                        `> 4. Serwer nie ponosi odpowiedzialności za działania użytkowników na zewnętrznych platformach (Vinted, OLX, Allegro itp.).\n\n` +

                        `**§2. ZASADY HANDLU I PROMOCJI**\n` +
                        `⛔ **Zakaz handlu na serwerze** – Zabrania się oferowania kupna/sprzedaży jakichkolwiek przedmiotów na kanałach publicznych.\n` +
                        `⛔ **Zakaz sprzedaży "jako oryginał"** – Surowo zabrania się prób sprzedaży replik jako oryginalnych produktów na platformach typu Vinted/OLX. Wszelkie pytania "czy to przejdzie na StockX" kończą się banem.\n` +
                        `⛔ **Zakaz reklamy** – Zakaz promowania własnych spreadsheetów, grup, serwerów Discord, kodów afiliacyjnych oraz kanałów social media bez zgody administracji.\n\n` +

                        `**§3. BEZPIECZEŃSTWO I DANE**\n` +
                        `🛡️ **Ochrona danych** – Całkowity zakaz udostępniania danych osobowych (doxxing), wizerunku oraz prywatnych rozmów innych użytkowników.\n` +
                        `🛡️ **Scam** – Wszelkie próby oszustwa, wyłudzenia pieniędzy lub kont będą zgłaszane do odpowiednich służb i skutkują natychmiastową blokadą.\n\n` +

                        `**§4. KULTURA I SPOŁECZNOŚĆ**\n` +
                        `• Zachowaj kulturę wypowiedzi. Wyzwiska, rasizm, homofobia i toksyczność są zakazane.\n` +
                        `• Nie oznaczaj (pinguj) administracji bez ważnego powodu.\n` +
                        `• Przestrzegaj oficjalnego Regulaminu Discord (ToS) oraz Wytycznych dla społeczności.`
                    )
                    .setColor('#FFFFFF') // Czysty biały
                    .setImage('https://cdn.discordapp.com/attachments/1469777712028713103/1470005849312460800/Zrzut_ekranu_2026-02-08_113757.png?ex=6989b921&is=698867a1&hm=c6e64adb6105da4dd9404e0cb0b3db2936bb4ac24f7b9334bddd9330d344d178') 
                    .setFooter({ text: 'LuckyReps © 2026 | Wszelkie prawa zastrzeżone' })
                    .setTimestamp();

                // 1. Cicha odpowiedź (ukrywa fakt użycia komendy)
                await interaction.reply({ content: '> Generowanie regulaminu...', ephemeral: true });

                // 2. Wysłanie czystego panelu na kanał
                await interaction.channel.send({ embeds: [embed] });
            }
        });
    }
};
