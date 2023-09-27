const { SlashCommandBuilder } = require('discord.js');
const { groups, groupLimits } = require('./editgroups.js');

const DEBUG = true;
function log(s){
    console.log(`${new Date()} lookingfor.js: ${s}`);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lookingfor')
		.setDescription('Looking for a group? Use this command to find one!')
        .addRoleOption(option => option
            .setName('group')
            .setDescription('What are you looking for?')
            .setRequired(true)
        ),
	async execute(interaction) {
        if (DEBUG) {
            log(interaction.user);
            log(interaction.member);
            log(interaction.guild);
            log(interaction.options.getString('group'));
        }
        let group = interaction.options.getRole('group');
        if (group.id in groups) {
            await interaction.reply(`${group.name} is in fact a group`);
        }
        else {
            await interaction.reply(`${group.name} is not a group`);
        }
	},
};