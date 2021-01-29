const formatCommits = (count: number): string => {
	count = count % 10;

	if (count === 1) {
		return 'коммит';
	} else if (count > 1 && count < 5) {
		return 'коммита';
	} else {
		return 'коммитов';
	}
};

export = formatCommits;
