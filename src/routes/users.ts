import express from 'express';
import {HTTP_STATUS} from "../types.js";
import {NUM_ONLY_REGEX} from './utils.js';
import {usersRepository} from '../repository/usersRepository.js';
import type {UserCreateModel} from "../models/userCreateModel.js";
import type {UserQueryModel} from "../models/userQueryModel.js";
import type {UserUpdateModel} from "../models/userUpdateModel.js";
import type {UserUriParamsModel} from "../models/userUriParamsModel.js";
import type {UserViewModel} from "../models/userViewModel.js";
import type {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types.js";
import type {Response} from 'express';

export const createUserRoutes = () => {
	const router = express.Router();

	router.post('/', (req: RequestWithBody<UserCreateModel>, res: Response) => {
		const name = req.body.name || '';
		if (!name) {
			res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
			return;
		}
		const user = usersRepository.createUser({name});
		res.status(HTTP_STATUS.CREATED_201).json(user);
	});
	
	router.get('/', (req: RequestWithQuery<UserQueryModel>, res: Response<UserViewModel[]>) => {
		const users = usersRepository.getUsersByName(req.query.name || '');
		return res.json(users);
	});

	router.get(`/:id(${NUM_ONLY_REGEX})`, (req: RequestWithParams<UserUriParamsModel>, res: Response<UserViewModel>) => {
		const user = usersRepository.getUserById(req.params.id);
		if (!user) {
			res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
			return;
		}
		res.json(user);
	});
	
	router.put(`/:id(${NUM_ONLY_REGEX})`, (req: RequestWithBody<UserUpdateModel, UserUriParamsModel>, res: Response) => {
		const userId = req.params.id;
		if (!userId) {
			res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
			return;
		}
		const newName = req.body.name || '';
		const updated = usersRepository.updateUser(userId, {name: newName});
		if (!updated) {
			res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
			return;
		}

		const user = usersRepository.getUserById(userId);
		res.sendStatus(HTTP_STATUS.OK_200).json(user);
	});
	
	router.delete(`/:id(${NUM_ONLY_REGEX})`, (req: RequestWithParams<UserUriParamsModel>, res: Response) => {
		const deleted = usersRepository.deleteUserById(req.params.id);
		if (!deleted) {
			res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
			return;
		}
		res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
	});

	return router;
};
