import FacepunchCommits from 'facepunch-commits';
import cron from 'node-cron';
import translate from './translate';
import { sendSboxChat } from './vk';
import Random from './modules/random';
import formatDate from './modules/formatDate';
import formatCommits from './modules/formatCommits';
import { ICommit } from 'facepunch-commits/dist/types/CommitsResponse';
import { slackAPI } from './modules/slackAPI';

const commits = new FacepunchCommits();

let commitsCount = 0;


const newCommit = async (commit: ICommit) => {
	commitsCount++;

	let translated = '';
	await translate(commit.message)
		.then(result => translated = result)
		.catch(err => {
			slackAPI.sendMessage(`Bad translate.\nError: ${JSON.stringify(err)}`);
			translated = 'Не удалось перевести.';
		});

	await sendSboxChat(`Новый коммит в ${commit.repo}!\nАвтор: ${commit.user.name}\nBranch: ${commit.branch}\nСообщение:\n${commit.message}\n\nПеревод:\n${translated}`);

	if (Random(0, 5) === 5) {
		await sendSboxChat('Хочешь узнавать о всех коммитах Facepunch Studio?\nТогда тебе сюда: https://discord.gg/ABmYenF');
	}
};

commits.subscribeToAll(commit => {
	if (commit.repo.indexOf('sbox') === -1) return;

	return newCommit(commit);
});

commits.catchRequest(async (err) => {
	let stringifyErr;
	if (!err.message) stringifyErr = JSON.stringify(err);

	return slackAPI.sendMessage(`Error request!\n${err.message ? err.message : stringifyErr}`);
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
