import {SHA256} from 'crypto-js';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import HttpException from '~/exceptions/HttpException';
import { DataStoredInToken, TokenData } from '~/interfaces/auth.interface';
import { User } from '~/sequelize/models/User';
import sequelizeConnection from '~/sequelize/config/database';
import logger from '~/logger';
import { CreateUserDto } from '~/dtos/users.dto';

export enum LoginType {
	GOOGLE = 'GOOGLE',
}

class AuthService {
	public async signUp(
		userData: CreateUserDto
	): Promise<any> {
		if (_.isEmpty(userData)) {
			throw new HttpException(400, 'invalid user data');
		}

		const t = await sequelizeConnection.transaction();
		try {
			const existingUser = await User.findOne({
				where: { email: userData.email },
			});
			if (existingUser) {
				throw new HttpException(409, 'user already exists');
			}

			let user: User;
			if (userData.type === 'GOOGLE') {
				user = await User.create(
					{
						email: userData.email,
						google_id: userData.google_id,
						name: userData.name,
					},
					{ transaction: t, returning: true }
				);
			} else {
				const hashedPass = SHA256(userData.password).toString();
				user = await User.create(
					{
						email: userData.email,
						password: hashedPass,
						name: userData.name,
					},
					{ transaction: t, returning: true }
				);
			}
			t.commit();
			return {
				id: user.id,
				email: user.email,
				name: user.name,
				google_id: user.google_id,
			};
		} catch (error) {
			t.rollback();
			logger.error('failed to signup',{ error, ns: 'AuthService.signUp'});
			throw new HttpException(error.status, error.message);
		}
	}

	public async logout(userData: User): Promise<User> {
		if (_.isEmpty(userData)) {
			throw new HttpException(400, 'invalid user data');
		}

		const user = await User.findOne({ where: { email: userData.email } });
		if (!user) {
			throw new HttpException(404, 'user not found');
		}

		return user;
	}

	public async createToken(user: User): Promise<TokenData> {
		let dataStoredInToken: DataStoredInToken = {
			id: user.id,
			email: user.email,
			google_id: user.google_id,
			createdAt: user.created_at,
		};
		const secret: string = process.env.JWT_SECRET as string;
		const expiresIn: number = 60 * 60 * 24;

		return {
			expiresIn,
			token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
		};
	}

	public createCookie = (tokenData: TokenData): string => {
		// TODO add secure
		return `Authorization=${tokenData.token}; HttpOnly; SameSite=Strict; Max-Age=${tokenData.expiresIn};`;
	}

	public async resetPassword(user: User, password: string): Promise<User> {
		const hashedPass = SHA256(password).toString();
		const updatedUser = await User.update(
			{ password: hashedPass },
			{ where: { id: user.id }, returning: true }
		);
		return updatedUser[1][0];
	}

	public checkEmail = async (emailId: any): Promise<any> => {
		const user = await User.findOne({
			where: { email: emailId },
		});
		return user;
	};
}
export default AuthService;
