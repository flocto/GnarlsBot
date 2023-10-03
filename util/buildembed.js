const { EmbedBuilder } = require("discord.js");

function buildEmbed(interaction, group) {
    // build an embed for a specific group
    let embed = new EmbedBuilder()
        .setTimestamp()
        .setColor("#E82E21")
        .setAuthor({
            name: "Gnarls",
            iconURL:
                "https://cdn.discordapp.com/avatars/1156043632634249217/b5d235fde4551f7309a4b3fe6108c8f1.webp?size=60",
        })
        .setTitle(interaction.guild.roles.cache.get(group.roleId).name)
        .setDescription(
            `Currently ${group.members.length}/${group.limit} members`
        )
        .setFooter({
            text: `Group ID: ${group.roleId}`,
        });

    // map all members to their own field
    if (group.members.length == 0) {
        embed.addFields([
            {
                name: "Members",
                value: "This group has no members!",
            },
        ]);
        return embed;
    } else {
        embed.addFields([
            {
                name: "Members",
                value: group.members.map((id) => `<@${id}>`).join("\n"),
            },
        ]);
    }

    return embed;
}

module.exports = {
    buildEmbed: buildEmbed,
};
