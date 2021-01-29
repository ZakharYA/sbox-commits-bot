const formatDate = (date: Date): string => {
	let day, month, year;

	const dd = date.getDate();
	dd < 10 ? day = '0' + dd : day = dd;

	const mm = date.getMonth() + 1;
	mm < 10 ? month = '0' + mm : month = mm;

	const yy = date.getFullYear() % 100;
	yy < 10 ? year = '0' + yy : year = yy;

	return `${day}.${month}.${year}`;
};

export = formatDate;
