import { button } from '../utils';

export default button('test_button', async ({ interaction, client }) => {
    return interaction.reply({
        content: `Test!`,
        ephemeral: true
    });
})