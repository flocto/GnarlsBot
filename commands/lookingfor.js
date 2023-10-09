const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const { groups } = require("./editgroups.js");
const { buildEmbed } = require("../util/buildembed.js");
const { DEBUG } = require("../config.json");

function log(s) {
    console.log(`${new Date()} lookingfor.js: ${s}`);
}

// TODO: make this process use ephemeral embeds where users can click on buttons to join/leave
// if the group fills via button, the embed is destroyed and the full ping message is sent like before
const joinButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setLabel("Join Group")
    .setEmoji("✅")
    .setCustomId("join");

const leaveButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel("Leave Group")
    .setEmoji("❌")
    .setCustomId("leave");

const buttons = new ActionRowBuilder().addComponents([joinButton, leaveButton]);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lookingfor")
        .setDescription("Looking for a group? Use this command to find one!")
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("What role are you looking for?")
                .setRequired(true)
        ),
    async execute(interaction) {
        if (DEBUG) {
            log(interaction.user);
            log(interaction.member);
            log(interaction.guild);
            log(interaction.options.getRole("role"));
        }
        let role = interaction.options.getRole("role");

        if (!(role.id in groups)) {
            await interaction.reply({
                content: `There is no group for ${role.name}!`,
                ephemeral: true,
            });
            return;
        }

        let group = groups[role.id];
        let embed = buildEmbed(interaction, group);

        let embedMessage = await interaction.reply({
            embeds: [embed],
            components: [buttons],
            ephemeral: true,
        });

        let collector = embedMessage.createMessageComponentCollector({
            time: 60000,
        });

        collector.on("collect", async (i) => {
            if (
                i.customId === "join" &&
                !group.isMember(interaction.member.id)
            ) {
                group.addMember(interaction.member.id);
                // check if full, if so ping all and clear group
                if (group.isFull()) {
                    let ping = group.members.map((id) => `<@${id}>`).join(",");
                    await i.channel.send({
                        content: `${ping}, ${role.name} is now full! Have fun!`,
                    });
                    await i.update({
                        content: "Group filled!",
                        embeds: [],
                        components: [],
                        ephemeral: true,
                    });
                    group.clear();
                    return;
                }
            } else if (
                i.customId === "leave" &&
                group.isMember(interaction.member.id)
            ) {
                group.removeMember(interaction.member.id);
            }

            await i.update({
                embeds: [buildEmbed(interaction, group)],
                components: [buttons],
                ephemeral: true,
            });
        });
    },
};
