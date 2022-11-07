require('./pgEnum-fix');
import { Dialect, Options, Sequelize } from 'sequelize';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USER } from '~/config';

const options: Options = {
	username: DB_USER,
	password: DB_PASSWORD,
	port: Number(DB_PORT),
	logging: false,
	sync: { alter: true, logging: false },
	database: DB_DATABASE,
	host: DB_HOST,
	dialect: DB_TYPE as Dialect,
	pool: { max: 20 },
	minifyAliases: true,
};

const sequelizeConnection = new Sequelize(options);
export default sequelizeConnection;
