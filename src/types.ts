import type {Request} from 'express';

export type RequestWithBody<T, P = {}> = Request<P, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;

type DbUser = {
	id: number;
	name: string;
};

export type Db = {
	users: DbUser[];
}

export const HTTP_STATUS = {
	OK_200: 200,
	CREATED_201: 201,
	NO_CONTENT_204: 204,

	BAD_REQUEST_400: 400,
	NOT_FOUND_404: 404,
};
