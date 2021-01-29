import { VK } from 'vk-io';
import config from 'config';

interface configurationVK {
	token: string,
	chatId: number
}

const vkConfig: configurationVK = config.get('vk');

export const vk = new VK({
	token: vkConfig.token
});

export const sendSboxChat = (message: string, attachment?: string): Promise<number> => {
	return vk.api.messages.send({
		random_id: 0,
		chat_id: vkConfig.chatId,
		message,
		dont_parse_links: 1,
		attachment
	});
};

