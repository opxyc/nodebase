import passportLocal from 'passport-local';
import { SHA256 } from 'crypto-js';
import passport from 'passport';
import HttpException from '~/exceptions/HttpException';
import { User } from '~/sequelize/models/User';

const LocalStrategy = passportLocal.Strategy;

function localStart() {
	passport.use(
		'login-strategy',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (email, password, done) => {
				const user = await User.findOne({ where: { email } });
				if (!user) {
					return done(new HttpException(401, 'invalid email or password'));
				}

				const passwordHash = SHA256(password).toString()
				if(passwordHash !== user.password) {
					return done(new HttpException(401, 'invalid email or password'));
				}

				return done(null, {
					id: user.id,
					email: user.email,
					name: user.name,
					google_id: user.google_id,
				})
			}
		)
	);
}

export default localStart;
