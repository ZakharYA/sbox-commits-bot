import fetch from 'node-fetch';

const translate = (text: string): Promise<string> => {
	const form = new URLSearchParams();

	form.append('sl', 'en');
	form.append('tl', 'ru');
	form.append('q', text);

	const params = new URLSearchParams({
		client: 'at',
		dt: 't',
		dj: 1,
		hl: 'ru',
		ie: 'UTF-8',
		oe: 'UTF-8',
		inputm: 2,
		otf: 2,
		iid: '1dd3b944-fa62-4b55-b330-74909a99969e'
	} as any);

	return fetch('https://translate.google.com/translate_a/single?' + params, {
		method: 'POST',
		body: form
	})
		.then((response) => {
			if (response.status !== 200) throw response;

			return response.json();
		})
		.then((result) => {
			let trans = '';
			for (let i = 0; i < result.sentences.length; i++) {
				trans = trans + result.sentences[i].trans;
			}

			return trans;
		});
};

export = translate;
