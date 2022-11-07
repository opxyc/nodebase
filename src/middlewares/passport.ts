import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

const googlePassport = (req: Request, res: Response, next: NextFunction) => {
	let domain: any = req.query.tk;
	const skipSelectAccount = req.query.redirected === 'true';
	const options: passport.AuthenticateOptions = {
		scope: ['profile', 'email'],
		passReqToCallback: true,
		state: domain,
		prompt: 'select_account',
	};
	if (skipSelectAccount) {
		delete options.prompt;
	}
	return passport.authenticate('google', options)(req, res, next);
};

export default googlePassport;
