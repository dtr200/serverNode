import {describe, it, expect} from '@jest/globals';
import request from 'supertest';
import {app} from '../../src/app.js';
import {ENDPOINT, HTTP_STATUS} from '../../src/types.js';
import {ERROR_URI} from './types.js';
import type {UserCreator} from './types.js';
import {DbUser} from '../../src/db/db.js';

describe('/users', () => {
	const USER: UserCreator = {
		toCreate: {
			first: {name: 'Aditya'},
			second: {name: 'Martin'},
		},
		toUpdate: {
			first: {name: 'Bhargava'},
			second: {name: 'Fowler'},
		}
	};

	beforeAll(async () => {
		await request(app)
			.delete(`/${ENDPOINT.Test}`)
			.expect(HTTP_STATUS.NO_CONTENT_204);
	});

	it('Should return an empty list of users', async () => {
		await request(app)
			.get(`/${ENDPOINT.Users}`)
			.expect(HTTP_STATUS.OK_200)
			.expect((res) => expect(res.body).toHaveLength(0));
	});

	it('Should return 404 error', async () => {
		await request(app)
			.get(`/${ENDPOINT.Users}/${ERROR_URI}`)
			.expect(HTTP_STATUS.NOT_FOUND_404)
	});

	let createdUser: DbUser | null = null;
	let createdUser2: DbUser | null = null;

	it('Creating a new user and trying to get it back with checking if it was added succesfully', async () => {
		const createdUserRes = await request(app)
			.post(`/${ENDPOINT.Users}`)
			.send(USER.toCreate.first)
			.expect(HTTP_STATUS.CREATED_201)
		
		createdUser = createdUserRes.body;
		expect(createdUser)
			.toEqual({
				id: expect.any(Number),
				...USER.toCreate.first,
			});
		
		await request(app)
			.get(`/${ENDPOINT.Users}`)
			.expect(HTTP_STATUS.OK_200)
			.expect((res) => expect(res.body).toEqual([createdUser]))
	});
	it('Creating another user and check if everything is added correctly with no interferrence to the previous one', async () => {
		const createdUserRes = await request(app)
			.post(`/${ENDPOINT.Users}`)
			.send(USER.toCreate.second)
			.expect(HTTP_STATUS.CREATED_201)

		createdUser2 = createdUserRes.body;
		await request(app)
			.get(`/${ENDPOINT.Users}`)
			.expect(HTTP_STATUS.OK_200)
			.expect((res) => expect(res.body).toEqual([createdUser, createdUser2]));
	});

	it('Should update the created user in the test above with check if it actually happened', async () => {
		await request(app)
			.put(`/${ENDPOINT.Users}/${createdUser?.id}`)
			.send(USER.toUpdate.first)
			.expect(HTTP_STATUS.OK_200)
		
		await request(app)
			.get(`/${ENDPOINT.Users}/${createdUser?.id}`)
			.expect(HTTP_STATUS.OK_200)
			.expect((res) => expect(res.body).toEqual({
				...createdUser,
				...USER.toUpdate.first,
			}))
	});
	it('Shouldnt update a user that is never existed', async () => {
		await request(app)
			.put(`/${ENDPOINT.Users}/${ERROR_URI}`)
			.send({name: 'Some name that actually will never applied'})
			expect(HTTP_STATUS.NOT_FOUND_404)
	})
})