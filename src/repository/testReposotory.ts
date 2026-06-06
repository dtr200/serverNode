import {db} from "../db/db.js";

export const testRepository = {
	async clearDb() {
		db.users = [];
	},
}