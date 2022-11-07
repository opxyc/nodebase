import { Request } from 'express';
import _ from 'lodash';
import HttpException from '~/exceptions/HttpException';

export const camelize = (obj: any): any => {
	if (obj?.dataValues) {
		return camelize(obj.dataValues);
	}

	if (_.isPlainObject(obj)) {
		const n: Record<string, any> = {};
		Object.keys(obj).forEach((k: string) => {
			n[_.camelCase(k)] = camelize(obj[k]);
		});
		return n;
	} else if (_.isArray(obj)) {
		return obj.reduce((n: any[], i: any) => [...n, camelize(i)], []);
	}
	return obj;
};

export const getIdFromParams = (req: Request): number => {
	const id = +req.params.id;
	if (!id) {
		throw new HttpException(400, 'invalid id');
	}

	return id;
};
