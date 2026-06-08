import express from 'express';
import {HTTP_STATUS} from "../types.js";
import {NUM_ONLY_REGEX} from './utils.js';
import {usersRepository} from '../repository/usersRepository.js';
import {body} from 'express-validator';
import type {UserCreateModel} from "../models/userCreateModel.js";
import type {UserQueryModel} from "../models/userQueryModel.js";
import type {UserUpdateModel} from "../models/userUpdateModel.js";
import type {UserUriParamsModel} from "../models/userUriParamsModel.js";
import type {UserViewModel} from "../models/userViewModel.js";
import type {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types.js";
import type {Response} from 'express';
import {inputValidationMiddleware} from '../middlewares/inputValidationMiddleware.js';

export const createUserRoutes = () => {
	const router = express.Router();

	const nameValidation = body('name').trim().notEmpty().isLength({min: 3}).withMessage('Title length must be over 3 characters');

	router.post(
		'/',
		nameValidation,
		inputValidationMiddleware,
		async (req: RequestWithBody<UserCreateModel>, res: Response) => {
			const user = await usersRepository.createUser({name: req.body.name});
			res.status(HTTP_STATUS.CREATED_201).json(user);
	});
	
	router.get('/', async (req: RequestWithQuery<UserQueryModel>, res: Response<UserViewModel[]>) => {
		const users = await usersRepository.getUsersByName(req.query.name || '');
		return res.json(users);
	});

	router.get(`/:id`, async (req: RequestWithParams<UserUriParamsModel>, res: Response<UserViewModel>) => {
		if (!NUM_ONLY_REGEX.test(req.params.id)) {
			res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
			return;
		}
		const user = await usersRepository.getUserById(req.params.id);
		if (!user) {
			res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
			return;
		}
		res.json(user);
	});
	
	router.put(
		`/:id`,
		nameValidation,
		inputValidationMiddleware,
		async (req: RequestWithBody<UserUpdateModel, UserUriParamsModel>, res: Response) => {
			if (!NUM_ONLY_REGEX.test(req.params.id)) {
				res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
				return;
			}
			const userId = req.params.id;
			if (!userId) {
				res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
				return;
			}
			const updated = await usersRepository.updateUser(userId, {name: req.body.name});
			if (!updated) {
				res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
				return;
			}

			const user = await usersRepository.getUserById(userId);
			res.sendStatus(HTTP_STATUS.OK_200).json(user);
	});
	
	router.delete(`/:id`, async (req: RequestWithParams<UserUriParamsModel>, res: Response) => {
		if (!NUM_ONLY_REGEX.test(req.params.id)) {
			res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
			return;
		}
		const deleted = await usersRepository.deleteUserById(req.params.id);
		if (!deleted) {
			res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
			return;
		}
		res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
	});

	return router;
};
