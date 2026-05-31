import express from 'express';
import type {Request, Response} from 'express';
import {HTTP_STATUS, type Db, type RequestWithBody, type RequestWithParams, type RequestWithQuery} from './types.js';
import type {UserCreateModel} from './models/userCreateModel.js';
import type {UserUpdateModel} from './models/userUpdateModel.js';
import type {UserQueryModel} from './models/userQueryModel.js';
import type {UserViewModel} from './models/userViewModel.js';
import type {UserUriParamsModel} from './models/userUriParamsModel.js';

export const app = express();
const port = process.env.PORT || 3000;
const jsonMiddleware = express.json();

app.use(jsonMiddleware);

const db: Db = {
	users: [
		{id: 1, name: 'Maria'},
		{id: 2, name: 'John'},
		{id: 3, name: 'Frank'},
		{id: 4, name: 'Bob'},
	],
};

app.post('/users', (req: RequestWithBody<UserCreateModel>, res: Response) => {
	const name = req.body.name as string;
	if (!name) {
		res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
		return;
	}
	const user = {id: +(new Date), name};
	db.users.push(user);
	res.status(HTTP_STATUS.CREATED_201).json(user);
});

app.get('/users', (req: RequestWithQuery<UserQueryModel>, res: Response<UserViewModel[]>) => {
	const name = req.query.name as string;
	let retval = db.users;
	if (!name) {
		res.json(retval);
		return;
	}
	retval = db.users.filter((u) => u.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
	return res.json(retval);
});
app.get('/users/:id', (req: RequestWithParams<UserUriParamsModel>, res: Response<UserViewModel>) => {
	const user = db.users.find((u) => `${u.id}` === req.params.id);
	if (!user) {
		res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		return;
	}
	res.json(user);
});

app.put('/users/:id', (req: RequestWithBody<UserUpdateModel, UserUriParamsModel>, res: Response) => {
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

app.delete('/users/:id', (req: RequestWithParams<UserUriParamsModel>, res: Response) => {
	const userId = req.params.id;
	if (!userId) {
		res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
		return;
	}

	db.users = db.users.filter((u) => `${u.id}` !== userId);
	res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});

app.listen(port, () => {
	console.log(`The app listening on port ${port}`)
});


app.delete('/__test__', (req: Request, res: Response) => {
	db.users = [];
	res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
