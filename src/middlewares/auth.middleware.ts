import { Request, NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken } from '~/interfaces/auth.interface';
import { User } from '~/sequelize/models/User';
import logger from '~/logger';

async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
	const authToken =
		req.cookies['Authorization'] ||
		(req.header('Authorization')
			? req.header('Authorization')?.split('Bearer ')[1]
			: null);

	if (authToken) {
		const secret = process.env.JWT_SECRET as string;
		try {
			const verificationResponse = jwt.verify(
				authToken,
				secret
			) as DataStoredInToken;

			const user = await User.findByPk(verificationResponse.id, { raw: true });
			if (user) {
				req.user = verificationResponse;
				next();
			} else {
				next(new HttpException(401, 'invalid authentication token'));
			}
		} catch (error) {
			logger.error(error, { ns: 'authMiddleware' });
			next(new HttpException(401, 'invalid authentication token'));
		}
	} else {
		next(new HttpException(400, 'authentication token missing'));
	}
}

export default authMiddleware;
