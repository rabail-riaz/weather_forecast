import axios from "axios";
import Config from "../constant/config"

export const headers = {
	'Content-Type': 'application/json',
}
export default function list(params: object = {}) {
	let req = {
		headers: headers,
		params: { ...params, appid: Config.APP_ID },
	}
	return axios.get(Config.API_ROOT_PATH, req).then(response => {
		return response;
	})
}