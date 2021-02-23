import { sendSboxChat, vk } from './vk';
import Random from './modules/random';
import { MessageContext } from 'vk-io';

let GROUP_ID = 0;

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

const checkInvite = (context: MessageContext<Record<string, any>>) => {
	console.log('check invite');
	vk.api.call('groups.isMember', {
		group_id: GROUP_ID,
		user_id: context.senderId
	})
		.then((result) => {
			console.log('groups.isMember then.');
			if (result) return context.send('Добро пожаловать в Сити 17.');
			console.log('is not join group');

			vk.api.call('messages.removeChatUser', {
				chat_id: context.peerId - 2000000000,
				user_id: context.senderId
			}).then((result) => {
				console.log('+kik');
				if (result) return context.send('Не прошёл проверку на bublikpro.');
			})
			.catch(err => {
				console.log(err);
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

vk.updates.on('message', async (context) => {
	if (!context.text) return;
	if (!context.isChat) return;

	if (context.eventType === TypeInvites.invite || context.eventType === TypeInvites.invite_link) return checkInvite(context);

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
