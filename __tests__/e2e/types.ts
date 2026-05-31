import type {UserCreateModel} from "../../src/models/userCreateModel.js";
import type {UserUpdateModel} from "../../src/models/userUpdateModel.js";
import type {Db} from "../../src/types.js";

export type DbUser = Db['users'][number] | null;
export type UserCreator = {
	toCreate: Record<string, UserCreateModel>;
	toUpdate: Record<string, UserUpdateModel>;
};

export enum ENDPOINT {
	Test = '__test__',
	Users = 'users',
}

export const ERROR_URI = -1;
