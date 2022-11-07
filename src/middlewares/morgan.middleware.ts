import morgan, { StreamOptions } from 'morgan';
import logger from '~/logger';

const stream: StreamOptions = {
	write: (message: string) =>
		logger.log({ level: 'access', message: message.trim() }),
};

const morganMiddleware = morgan(
	':remote-addr :method :url :status :res[content-length] - :response-time ms',
	{ stream }
);

export default morganMiddleware;
