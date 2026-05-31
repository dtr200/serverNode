import type {UserCreateModel} from "../../src/models/userCreateModel.js";
import type {UserUpdateModel} from "../../src/models/userUpdateModel.js";

export type UserCreator = {
	toCreate: Record<string, UserCreateModel>;
	toUpdate: Record<string, UserUpdateModel>;
};

export const ERROR_URI = -1;
