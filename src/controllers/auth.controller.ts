import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import AuthService from '~/services/auth.service';
import HttpException from '~/exceptions/HttpException';
import { User } from '~/sequelize/models/User';
import { CreateUserDto } from '~/dtos/users.dto';

class AuthController {
	public authService = new AuthService();

	public signUp = async (req: Request, res: Response, next: NextFunction) => {
		const userData: CreateUserDto = req.body;

		try {
			const user = await this.authService.signUp(userData);
			res.status(201).json({ user });
		} catch (error) {
			next(error);
		}
	};

	public login = async (req: any, res: Response, next: NextFunction) => {
		try {
			passport.authenticate(
				'login-strategy',
				{ session: false },
				async (err: HttpException, user: User) => {
					if (err) {
						next(err);
					} else {
						const tokenData = await this.authService.createToken(user);
						const cookie = this.authService.createCookie(tokenData);

						res.setHeader('Set-Cookie', [cookie]);
						res.status(200).json({ user });
					}
				}
			)(req, res, next);
		} catch (error) {
			next(error);
		}
	};

	public logout = async (req: Request, res: Response, next: NextFunction) => {
		const userData = req.user as User;

		try {
			await this.authService.logout(userData);

			res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	};

	public resetPassword = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (!req.body.password || req.body.password === '') {
			next(new HttpException(400, 'no valid password is passed'));
		}
		try {
			const userData = req.user as User;
			await this.authService.resetPassword(userData, req.body.password);
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	};

	public checkEmailAvailability = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		let { email_id } = req.params;
		try {
			let userData = await this.authService.checkEmail(email_id);
			if (userData) {
				res.json({
					exists: true,
					message: 'user with the given email id already exists',
				});
			} else {
				res.json({ exists: false, message: 'email is available' });
			}
		} catch (error) {
			next(error);
		}
	};

	public googlePassportAuth = (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		return passport.authenticate(
			'google',
			{
				failureRedirect: '/api/v1/auth/google/failed',
			},
			async (err: HttpException, user: User | any) => {
				if (err) {
					next(err);
				} else {
					const jwtToken = await this.authService.createToken(user);
					res.redirect(
						`${process.env.DASHBOARD_URL}/auth/log-in?success=true&token=${jwtToken.token}`
					);
				}
			}
		)(req, res, next);
	};
}

export default AuthController;
