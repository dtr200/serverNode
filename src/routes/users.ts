import express from 'express';
import {HTTP_STATUS} from "../types.js";
import type {Db} from "../db/db.js";
import type {UserCreateModel} from "../models/userCreateModel.js";
import type {UserQueryModel} from "../models/userQueryModel.js";
import type {UserUpdateModel} from "../models/userUpdateModel.js";
import type {UserUriParamsModel} from "../models/userUriParamsModel.js";
import type {UserViewModel} from "../models/userViewModel.js";
import type {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types.js";
import type {Response} from 'express';
import {NUM_ONLY_REGEX} from './utils.js';

export const createUserRoutes = (db: Db) => {
	const router = express.Router();

	router.post('/', (req: RequestWithBody<UserCreateModel>, res: Response) => {
		const name = req.body.name as string;
		if (!name) {
			res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
			return;
		}
		const user = {id: +(new Date), name};
		db.users.push(user);
		res.status(HTTP_STATUS.CREATED_201).json(user);
	});
	
	router.get('/', (req: RequestWithQuery<UserQueryModel>, res: Response<UserViewModel[]>) => {
		const name = req.query.name as string;
		let retval = db.users;
		if (!name) {
			res.json(retval);
			return;
		}
		retval = db.users.filter((u) => u.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
		return res.json(retval);
	});

	router.get(`/:id(${NUM_ONLY_REGEX})`, (req: RequestWithParams<UserUriParamsModel>, res: Response<UserViewModel>) => {
		const user = db.users.find((u) => `${u.id}` === req.params.id);
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
		const newName = req.body.name as string;
		const user = db.users.find((u) => `${u.id}` === userId);
		if (!user) {
			res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
			return;
		}
	
		user.name = newName;
		res.sendStatus(HTTP_STATUS.OK_200);
	});
	
	router.delete(`/:id(${NUM_ONLY_REGEX})`, (req: RequestWithParams<UserUriParamsModel>, res: Response) => {
		const userId = req.params.id;
		if (!userId) {
			res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
			return;
		}
	
		db.users = db.users.filter((u) => `${u.id}` !== userId);
		res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
	});

	return router;
};
