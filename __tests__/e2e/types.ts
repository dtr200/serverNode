import type {UserCreateModel} from "../../src/models/userCreateModel.js";
import type {UserUpdateModel} from "../../src/models/userUpdateModel.js";
import type {Db} from "../../src/db/db.js";

export type DbUser = Db['users'][number] | null;
export type UserCreator = {
	toCreate: Record<string, UserCreateModel>;
	toUpdate: Record<string, UserUpdateModel>;
};

export const ERROR_URI = -1;
