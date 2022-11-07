import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import HttpException from '~/exceptions/HttpException';

const buildErrorDetails = (
	error: ValidationError
): string | Record<string, any> => {
	if (!error.children?.length) {
		return Object.values(error.constraints!).join(',');
	}

	return error.children.reduce(
		(errorDetails: any, error: ValidationError) => ({
			...errorDetails,
			[error.property]: buildErrorDetails(error),
		}),
		{}
	);
};

const validationMiddleware = (
	type: any,
	skipMissingProperties = false
): RequestHandler => {
	return (req, _res, next) => {
		validate(plainToClass(type, req.body), { skipMissingProperties }).then(
			(errors: ValidationError[]) => {
				if (errors.length > 0) {
					const errorDetails: any = {};
					for (const error of errors) {
						errorDetails[error.property] = buildErrorDetails(error);
					}
					next(new HttpException(400, errorDetails));
				} else {
					next();
				}
			}
		);
	};
};

export default validationMiddleware;
