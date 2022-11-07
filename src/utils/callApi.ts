import axios from 'axios';
import HttpException from '~/exceptions/HttpException';

async function callApi(data: any) {
	try {
		const res = await axios({
			method: data.method,
			url: data.url,
			data: data.body,
			headers: data.headers,
		});
		return res.data;
	} catch (err) {
		throw new HttpException(500, 'something went wrong');
	}
}

export default callApi;
