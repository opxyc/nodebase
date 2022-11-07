import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import passport from 'passport';
import Routes from '~/interfaces/routes.interface';
import errorMiddleware from '~/middlewares/error.middleware';
import * as strategies from '~/strategies/auth-strategy';
import sequelizeConnection from '~/sequelize/config/database';
import morgan from './middlewares/morgan.middleware';
import { COOKIE_ORIGIN, PORT } from '~/config';
import logger from './logger';

class App {
	public app: express.Application;
	public port: string | number;
	public env: boolean;

	constructor(routes: Routes[]) {
		this.app = express();
		this.port = PORT || 3000;

		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

	public listen() {
		this.app.listen(this.port, () => {
			logger.info(`server listening on PORT: ${this.port}`);
		});
	}

	public getServer() {
		return this.app;
	}

	private async connectToDatabase() {
		try {
			await sequelizeConnection.authenticate();
			logger.info('connected to database');
			sequelizeConnection.sync().catch((err) => logger.error(err));
		} catch (err) {
			logger.error(err);
		}
	}

	private initializeMiddlewares() {
		this.app.use(morgan);
		this.app.use(
			cors({
				origin: COOKIE_ORIGIN === '*' ? true : COOKIE_ORIGIN,
				credentials: true,
			})
		);
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		Object.values(strategies.default).forEach((module: any) => {
			Object.values(module).forEach((strategy: any) => {
				strategy(passport);
			});
		});
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach((route) => this.app.use('/api/v1', route.router));
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}
}

export default App;
