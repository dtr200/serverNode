import {db} from "../db/db.js";

export const testRepository = {
	clearDb() {
		db.users = [];
	},
}