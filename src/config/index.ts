import { config } from 'dotenv';
config({ path: '.env' });

export const CREDENTIALS = process.env.COOKIE_CREDENTIALS === 'true';
export const {
	NODE_ENV,
	PORT,
	DASHBOARD_URL,
	JWT_SECRET,
	DB_HOST,
	DB_PORT,
	DB_USER,
	DB_PASSWORD,
	DB_DATABASE,
	DB_TYPE,
	COOKIE_ORIGIN,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
} = process.env;
