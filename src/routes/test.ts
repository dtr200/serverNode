import express from 'express';
import {HTTP_STATUS} from '../types.js';
import {testRepository} from '../repository/testReposotory.js';
import type {Request, Response} from 'express';

export const createTestRoutes = () => {
	const router = express.Router();

	router.delete('/', (req: Request, res: Response) => {
		testRepository.clearDb();
		res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
	});

	return router;
};
