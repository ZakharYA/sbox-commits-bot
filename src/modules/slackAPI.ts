import fetch from 'node-fetch';

import config from 'config';

interface configurationSLACK {
	webhook: string
}

const configuration: configurationSLACK = config.get('slack');

class _SLACK {
	webhook: string;

	constructor(webhook: string) {
		this.webhook = webhook;
	}


	async sendMessage(message: string) {
		return fetch(`${this.webhook}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text: message
			})
		});
	}
}

export const slackAPI = new _SLACK(configuration.webhook);