import { User } from '~/sequelize/models/User';
import AuthService from '~/services/auth.service';
import logger from '~/logger';
import { CreateUserDto } from '~/dtos/users.dto';
var GoogleStrategy = require('passport-google-oauth2').Strategy;

let authService = new AuthService();
const googleAuth = (passport: any) => {
	passport.serializeUser(function (user: any, done: any) {
		done(null, user);
	});

	passport.deserializeUser(function (user: any, done: any) {
		done(null, user);
	});
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				callbackURL: `${process.env.DASHBOARD_URL}/api/auth/google/callback`,
				passReqToCallback: true,
			},
			async function (
				_request: any,
				_accessToken: any,
				_refreshToken: any,
				profile: any,
				done: any
			) {
				try {
					let user = await User.findOne({
						where: { email: profile.email },
						attributes: {
							exclude: ['password', 'created_at', 'updated_at', 'deleted_at'],
						},
					});

					if (!user) {
						let signUpData: CreateUserDto = {
							email: profile.email,
							type: 'GOOGLE',
							google_id: profile.sub,
							name: profile.displayName,
							password: '',
						};

						const response = await authService.signUp(signUpData);
						return done(null, response);
					}

					return done(null, user);
				} catch (error) {
					logger.error('failed to authenticate with google',{ error, ns: 'googleAuth'});
					return done(error);
				}
			}
		)
	);
};

export default googleAuth;
