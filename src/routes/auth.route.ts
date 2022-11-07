import { Router } from 'express';
import AuthController from '~/controllers/auth.controller';
import { CreateUserDto, LoginDto } from '~/dtos/users.dto';
import Route from '~/interfaces/routes.interface';
import authMiddleware from '~/middlewares/auth.middleware';
import googlePassport from '~/middlewares/passport';
import validationMiddleware from '~/middlewares/validation.middleware';
import { Request, Response } from 'express';

class AuthRoute implements Route {
	public path = '/auth';
	public router = Router();
	public authController = new AuthController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			`${this.path}/signup`,
			validationMiddleware(CreateUserDto),
			this.authController.signUp
		);
		this.router.post(
			`${this.path}/login`,
			validationMiddleware(LoginDto),
			this.authController.login
		);
		this.router.post(
			`${this.path}/logout`,
			authMiddleware,
			this.authController.logout
		);
		this.router.post(
			`${this.path}/reset-password`,
			authMiddleware,
			this.authController.resetPassword
		);
		this.router.get(
			`${this.path}/check-email-exists/:email_id`,
			authMiddleware,
			this.authController.checkEmailAvailability
		);
		this.router.get(`${this.path}/google`, googlePassport);
		this.router.get(
			`${this.path}/google/callback`,
			this.authController.googlePassportAuth
		);
		this.router.get(
			`${this.path}/google/failed`,
			(_req: Request, res: Response) => {
				res.redirect(
					`${process.env.BUSINESS_DASHBOARD_URL}/auth/log-in?success=false&google-verification=false`
				);
			}
		);
	}
}

export default AuthRoute;
