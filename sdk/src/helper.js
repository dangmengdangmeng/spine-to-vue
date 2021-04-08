export default class Helper {
	static parseJson(data) {
		if (typeof data === 'string') {
			return (new Function("return " + data))();
		}
		return data;
	}

	static deepCopy(data) {
		let newData = data;
		try {
			newData = JSON.parse(JSON.stringify(data));
		} catch (e) {
			return newData;
		}
		return newData;
	}
}
