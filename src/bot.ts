import { sendSboxChat, vk } from './vk';
import Random from './modules/random';
import { MessageContext } from 'vk-io';

type IContext = MessageContext<Record<string, any>>;

let GROUP_ID = 0;

const isNumeric = (n: string) => {
	return !isNaN(parseFloat(n)) && isFinite(Number(n));
};

(() => {
	vk.api.call('groups.getById', {})
		.then((response) => {
			GROUP_ID = response[0].id;
		})
		.catch(() => {
			console.error('bad token');
			process.exit(1);
		});
})();

const TypeInvites = {
	invite: 'chat_invite_user',
	invite_link: 'chat_invite_user_by_link'
};

const wordsASK = ['Да', 'Нет', 'Иди нахуй'];

const checkInvite = (context: MessageContext<Record<string, any>>) => {
	vk.api.call('groups.isMember', {
		group_id: GROUP_ID,
		user_id: context.senderId
	})
		.then((result) => {
			if (result) return context.send('Добро пожаловать в Сити 17.');

			vk.api.call('messages.removeChatUser', {
				chat_id: context.peerId - 2000000000,
				user_id: context.senderId
			}).then((result) => {
				if (result) return context.send('Не прошёл проверку на bublikpro.');
			});
		});
};

const commands:{[key: string]: (context: IContext, args: string[]) => void} = {};

const createCommand = (commandName: string, callback: (context: IContext, args: string[]) => void) => {
	commands[commandName] = callback;
};

createCommand('try', context =>
	context.reply(Random(0, 1) ? 'Удачно.' : 'Неудачно.'));

createCommand('ask', (context, args) => {
	if (!args[1]) return;

	const text = args.splice(0, 1) && args.join(' ');
	if (text.length < 2 || text.slice(-1) !== '?') return context.reply('Длина вопроса должна быть > 2 и чтобы он заканчивался знаком вопроса.');

	return context.reply(`${wordsASK[Random(0, wordsASK.length - 1)]}.`);
});

createCommand('что', (context, args) => {
	if (!args[1]) return;

	const ans = args[1];
	const text = args.splice(0, 2) && args.join(' ');
	if (!text.length) return;

	const findText = text.split(' или ');
	if (findText.length === 1) return;

	const reText = findText[Random(0, findText.length - 1)];

	return context.reply(`Я думаю, что ${reText} ${ans}.`);
});

createCommand('рандом', (context, args) => {
	if (!args[1] || !args[2]) return context.reply('Не задано минимальное/максимальное значение.');

	if (!isNumeric(args[1]) || !isNumeric(args[2])) return context.reply('Значение должно быть числом.');

	const min = Number(args[1]), max = Number(args[2]);

	if (min > max) return context.reply('Минимальное число > максимального.');

	return context.reply(`Результат: ${Random(min, max)}`);
});

vk.updates.on('message', async (context) => {
	if (!context.isChat) return;

	if (context.eventType === TypeInvites.invite || context.eventType === TypeInvites.invite_link) return checkInvite(context);

	if (!context.text) return;

	const args = context.text.split(' ');

	if (args[0].startsWith('/')) {
		if (commands[args[0].slice(1)]) return commands[args[0].slice(1)](context, args);
	}
});

vk.updates.start()
	.then(() => {
		console.log('started');
		return sendSboxChat(`Started! ${Date()}`);
	})
	.catch(console.error);
