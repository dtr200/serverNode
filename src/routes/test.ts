import express from 'express';
import {HTTP_STATUS} from '../types.js';
import type {Request, Response} from 'express';
import type {Db} from '../db/db.js';

export const createTestRoutes = (db: Db) => {
	const router = express.Router();

	router.delete('/', (req: Request, res: Response) => {
		db.users = [];
		res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
	});

	return router;
};
