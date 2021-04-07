process.env.TZ = 'Europe/Moscow';

import config from 'config';
import * as Sentry from '@sentry/node';

import './bot';
import './commits';


if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn: config.get('app.sentryDsn'),
		tracesSampleRate: 1.0
	});
}