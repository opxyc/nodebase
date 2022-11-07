import winston from 'winston';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	access: 3,
	debug: 4,
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	access: 'gray',
	debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
	winston.format.timestamp(),
	winston.format.metadata({
		fillExcept: ['message', 'level', 'timestamp', 'label'],
	}),
	winston.format.colorize({ all: true }),
	winston.format.printf(
		(info) =>
			`${info.timestamp} ${info.level}: ${info.message} ${JSON.stringify(
				info.metadata
			)}`
	)
);

const transports = [new winston.transports.Console()];

const logger = winston.createLogger({
	level: 'debug',
	levels,
	format,
	transports,
});

export default logger;
