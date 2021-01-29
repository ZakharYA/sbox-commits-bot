import FacepunchCommits from 'facepunch-commits';
import cron from 'node-cron';
import config from 'config';
import translate from './translate';
import { sendSboxChat, vk } from './vk';
import Random from './modules/random';
import formatDate from './modules/formatDate';
import formatCommits from './modules/formatCommits';
import { ICommit } from 'facepunch-commits/dist/types/CommitsResponse';

const commits = new FacepunchCommits();

let commitsCount = 0;

const subscribed = [
	'sandbox.source',
	'Fad',
	'sandbox.source2',
	'sbox'
];

const ADMIN_ID = config.get('vk.adminId');

const newCommit = async (commit: ICommit) => {
	commitsCount++;

	let translated = 'bad translate';
	await translate(commit.message)
		.then((result) => {
			translated = result;
		})
		.catch((err) => {
			console.error(err);
		});

	await sendSboxChat(`Новый коммит в ${commit.repo}!\nАвтор: ${commit.user.name}\nBranch: ${commit.branch}\nСообщение:\n${commit.message}\n\nПеревод:\n${translated}`);

	if (Random(0, 5) === 5) {
		await sendSboxChat('Хочешь узнавать о всех коммитах Facepunch Studio?\nТогда тебе сюда: https://discord.gg/ABmYenF');
	}
};

subscribed.map((value) => {
	commits.subscribeToRepository(value, newCommit);
});

commits.catchRequest(async (err) => {
	let stringifyErr;
	if (!err.message) stringifyErr = JSON.stringify(err);

	if (typeof ADMIN_ID !== 'number') return; // fuck

	await vk.api.messages.send({
		user_id: ADMIN_ID,
		random_id: 0,
		message: `Error request!\n${err.message ? err.message : stringifyErr}`
	});
});

cron.schedule('59 23 * * *', () => {
	let message = `Статистика за ${formatDate(new Date())}:\nСделано коммитов: `;

	if (!commitsCount) {
		message = message + '0\n👍';
	} else {
		const format = formatCommits(commitsCount);
		message = `${message} ${commitsCount} ${format}.`;
		commitsCount = 0;
	}

	return sendSboxChat(message);
});
