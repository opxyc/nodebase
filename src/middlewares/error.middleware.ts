import { Request, Response, NextFunction } from 'express';
import HttpException from '~/exceptions/HttpException';
import logger from '~/logger';

function errorMiddleware(
	error: HttpException,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	const status: number = error.status || 500;
	const message: string =
		error.message || 'internal server error, please try again later.';

	logger.error(
		`${req.socket.remoteAddress} ${req.method} ${req.path} ${status}`,
		error
	);
	res.status(status).json({ message });
}

export default errorMiddleware;
