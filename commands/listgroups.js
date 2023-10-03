const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const { buildEmbed } = require("../util/buildembed.js");
const { groups } = require("./editgroups.js");
const { DEBUG } = require("../config.json");

function log(s) {
    if (s instanceof Object) s = JSON.stringify(s);
    console.log(`${new Date()} listgroups.js: ${s}`);
}

const backButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Previous Group")
    .setEmoji("⬅️")
    .setCustomId("previous");

const forwardButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Next Group")
    .setEmoji("➡️")
    .setCustomId("next");

module.exports = {
    groups: groups,
    data: new SlashCommandBuilder()
        .setName("listgroups")
        .setDescription("List all current groups"),
    async execute(interaction) {
        if (DEBUG) {
            log(interaction.user);
            log(interaction.member);
            log(interaction.guild);
            log(interaction.options);
        }

        let pages = [];
        for (let roleId in groups) {
            pages.push(buildEmbed(interaction, groups[roleId]));
        }
        if (!pages.length) {
            await interaction.reply("No current groups!");
            return;
        }

        let currentPage = 0;
        let onePage = pages.length == 1;
        let embedMessage = await interaction.reply({
            embeds: [pages[currentPage]],
            components: onePage
                ? []
                : [new ActionRowBuilder().addComponents([forwardButton])],
        });
        if (onePage) {
            return;
        }

        // collector for buttons
        const collector = embedMessage.createMessageComponentCollector({
            time: 60000,
        });

        // thank you SO
        // https://stackoverflow.com/questions/60691780/how-do-you-make-embed-pages-in-discord-js
        collector.on("collect", async (i) => {
            i.customId === "next" ? currentPage++ : currentPage--;

            await i.update({
                embeds: [pages[currentPage]],
                components: [
                    new ActionRowBuilder().addComponents([
                        ...(currentPage === 0 ? [] : [backButton]),
                        ...(currentPage === pages.length - 1
                            ? []
                            : [forwardButton]),
                    ]),
                ],
            });
        });
    },
};
