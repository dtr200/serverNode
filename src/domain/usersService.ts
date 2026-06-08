import {type DbUser} from "../db/db.js";
import {usersRepositoryDb} from "../repository/usersRepositoryDb.js";

export const usersService = {
	async createUser(data: Omit<DbUser, 'id'>) {
		const user = {
			...data,
			id: +(new Date),
		};
		return await usersRepositoryDb.createUser(user);
	},
	async getUsersByName(name: string) {
		return usersRepositoryDb.getUsersByName(name);
	},
	async getUserById(id: string) {
		return usersRepositoryDb.getUserById(+id);
	},
	async updateUser(id: string, data: Partial<Omit<DbUser, 'id'>>) {
		return await usersRepositoryDb.updateUser(
			+id,
			{...data},
		);
	},
	async deleteUserById(id: string) {
		return await usersRepositoryDb.deleteUserById(+id);
	},
}