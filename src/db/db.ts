type DbUser = {
	id: number;
	name: string;
};

export type Db = {
	users: DbUser[];
};

export const db: Db = {
	users: [
		{id: 1, name: 'Maria'},
		{id: 2, name: 'John'},
		{id: 3, name: 'Frank'},
		{id: 4, name: 'Bob'},
	],
};
