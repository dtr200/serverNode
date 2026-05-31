import {db, type DbUser} from "../db/db.js";

export const usersRepository = {
	createUser(data: Omit<DbUser, 'id'>) {
		const user = {
			...data,
			id: +(new Date),
		};
		db.users.push(user);
		return user;
	},
	getUsersByName(name: string) {
		const foundUsers = db.users.filter((u) =>
			u.name.toLowerCase().indexOf(name.toLowerCase()) > -1
		);

		if (!foundUsers.length) return db.users;
		return foundUsers;
	},
	getUserById(id: string) {
		return db.users.find((u) => `${u.id}` === id);
	},
	updateUser(id: string, data: Partial<Omit<DbUser, 'id'>>) {
		const user = usersRepository.getUserById(id);
		if (!user) return false;

		Object.assign(user, data);
		return true;
	},
	deleteUserById(id: string) {
		const hasUser = usersRepository.getUserById(id);
		if (!hasUser) return false;

		db.users = db.users.filter((u) => `${u.id}` !== id);
		return true
	},
}