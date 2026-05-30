import express from 'express';
import type {Request, Response} from 'express';

export const app = express();
const port = process.env.PORT || 3000;
const jsonMiddleware = express.json();

app.use(jsonMiddleware);

export const HTTP_STATUS = {
	OK_200: 200,
	CREATED_201: 201,
	NO_CONTENT_204: 204,

	BAD_REQUEST_400: 400,
	NOT_FOUND_404: 404,
};

export type DbUser = {
	id: number;
	name: string;
};

const db = {
	users: [
		{id: 1, name: 'Maria'},
		{id: 2, name: 'John'},
		{id: 3, name: 'Frank'},
		{id: 4, name: 'Bob'},
	],
};

app.post('/users', (req: Request, res: Response) => {
	const name = req.body.name as string;
	if (!name) {
		res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
		return;
	}
	const user = {id: +(new Date), name};
	db.users.push(user);
	res.status(HTTP_STATUS.CREATED_201).json(user);
});

app.get('/users', (req: Request, res: Response) => {
	const name = req.query.name as string;
	let retval = db.users;
	if (!name) {
		res.json(retval);
		return;
	}
	retval = db.users.filter((u) => u.name.toLowerCase().indexOf(name.toLowerCase()) > -1);
	return res.json(retval);
});
app.get('/users/:id', (req: Request, res: Response) => {
	const user = db.users.find((u) => `${u.id}` === req.params.id);
	if (!user) {
		res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		return;
	}
	res.json(user);
});

app.put('/users/:id', (req: Request, res: Response) => {
	const userId = req.params.id as string;
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

app.delete('/users/:id', (req: Request, res: Response) => {
	const userId = req.params.id as string;
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
