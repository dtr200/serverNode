import {type Filter} from "mongodb";
import {type DbUser} from "../db/db.js";
import {userCollection} from "./db.js";

export const usersRepositoryDb = {
	async createUser(data: DbUser) {
		return await userCollection.insertOne(data);
	},
	async getUsersByName(name: string) {
		const filter: Filter<DbUser> = {};

		if (name) {
			filter.name = {$regex: name.toLowerCase()};
		}

		return userCollection.find(filter).toArray();
	},
	async getUserById(id: number) {
		return userCollection.findOne({id});
	},
	async updateUser(id: number, data: Partial<Omit<DbUser, 'id'>>) {
		const result = await userCollection.updateOne(
			{id},
			{...data},
		);
		return result.matchedCount === 1;
	},
	async deleteUserById(id: number) {
		const result = await userCollection.deleteOne({id});
		return result.deletedCount === 1;
	},
}