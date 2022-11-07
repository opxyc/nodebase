const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
module.exports = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		seederStorage: 'sequelize',
		seederStorageTableName: 'sequelize_seed_run_log',
	},
	test: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		seederStorage: 'sequelize',
		seederStorageTableName: 'sequelize_seed_run_log',
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		seederStorage: 'sequelize',
		seederStorageTableName: 'sequelize_seed_run_log',
	},
};
