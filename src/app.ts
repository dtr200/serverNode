import express from 'express';
import {createUserRoutes} from './routes/users.js';
import {createTestRoutes} from './routes/test.js';
import {db} from './db/db.js';
import {ENDPOINT} from './types.js';

export const app = express();
const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.use(`/${ENDPOINT.Users}`, createUserRoutes(db));
app.use(`/${ENDPOINT.Test}`, createTestRoutes(db));
