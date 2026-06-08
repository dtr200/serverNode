import express, {type NextFunction} from 'express';
import {createUserRoutes} from './routes/users.js';
import {createTestRoutes} from './routes/test.js';
import {ENDPOINT} from './types.js';

export const app = express();
const jsonMiddleware = express.json();
const testAuthGuardMiddleware = (req: any, res: any, next: NextFunction) => {
	if (req.body.token === 'test') {
		next();
		return;
	}
	res.sendStatus(401);
}

app.use(jsonMiddleware);
// app.use(testAuthGuardMiddleware);

app.use(`/${ENDPOINT.Users}`, createUserRoutes());
app.use(`/${ENDPOINT.Test}`, createTestRoutes());
