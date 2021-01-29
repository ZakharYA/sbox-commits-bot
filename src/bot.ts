import { sendSboxChat, vk } from './vk';
import Random from './modules/random';

vk.updates.on('message', async (context) => {
	if (!context.text) return;
	if (!context.isChat) return;

	const args = context.text.split(' ');

	if (args[0] === '/try')
		return await context.reply(Random(0, 1) ? 'Удачно.' : 'Неудачно.');

	if (args[0] === '/ask' && args[1]) {
		const text = args.splice(0, 1) && args.join(' ');
		if (text.length < 2 || text.slice(-1) !== '?') return context.reply('Длина вопроса должна быть > 2 и чтобы он заканчивался знаком вопроса.');

		return await context.reply(Random(0, 1) ? Random(0, 1) ? 'Да.' : 'Иди нахуй.' : 'Нет.');
	}

	if (args[0] === '/что' && args[1]) {
		const ans = args[1];
		const text = args.splice(0, 2) && args.join(' ');
		if (!text.length) return;

		const findText = text.split(' или ');
		if (findText.length === 1) return;

		const reText = findText[Random(0, findText.length - 1)];

		await context.reply(`Я думаю, что ${reText} ${ans}.`);
	}
});

vk.updates.start()
	.then(() => {
		console.log('started');
		return sendSboxChat(`Started! ${Date()}`);
	})
	.catch(console.error);
