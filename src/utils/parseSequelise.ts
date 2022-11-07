function parseRawData(data: any) {
	return JSON.parse(JSON.stringify(data, null, 2));
}
export default parseRawData;
