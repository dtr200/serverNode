import {ObjectId, type Filter} from "mongodb";
import {type DbUser} from "../db/db.js";
import {userCollection} from "./db.js";

export const usersRepositoryDb = {
	async createUser(data: Omit<DbUser, 'id'>) {
		const user = {
			...data,
			id: +(new Date),
		};
		const result = await userCollection.insertOne(user);
		return user;
	},
	async getUsersByName(name: string) {
		const filter: Filter<DbUser> = {};

		if (name) {
			filter.name = {$regex: name.toLowerCase()};
		}

		return userCollection.find(filter).toArray();
	},
	async getUserById(id: string) {
		return userCollection.find({id: +id});
	},
	async updateUser(id: string, data: Partial<Omit<DbUser, 'id'>>) {
		const result = await userCollection.updateOne(
			{id: +id},
			{...data},
		);
		return result.matchedCount === 1;
	},
	async deleteUserById(id: string) {
		const result = await userCollection.deleteOne(
			{['_id']: new ObjectId(id)},
		);
		return result.deletedCount === 1;
	},
}