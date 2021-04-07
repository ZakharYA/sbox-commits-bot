import fetch from 'node-fetch';
import config from 'config';

interface configurationTG {
	token: string,
	targetId: number
}

const configuration: configurationTG = config.get('tg');

class _TGAPI {
	key: string;
	targetId: number;
	config: {
		apiUrl: string
	}

	constructor(key: string, targetId: number) {
		this.key = key;
		this.targetId = targetId;

		this.config = {
			apiUrl: 'https://api.telegram.org/bot'
		};
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	async request(method: string, params: object) {
		return fetch(`${this.config.apiUrl}${this.key}/${method}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		});
	}

	async sendMessage(text: string) {
		return this.request('sendMessage', { chat_id: this.targetId, text });
	}
}

export const TGAPI = new _TGAPI(configuration.token, configuration.targetId);