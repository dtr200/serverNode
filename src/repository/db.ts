import {MongoClient} from 'mongodb';

export type DbUser = {
	id: number;
	name: string;
};

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017';

const client = new MongoClient(mongoUri);
const db = client.db('users');
export const userCollection = db.collection<DbUser>('list');

export async function runDb() {
	try {
		await client.connect();
		await client.db('users');
		console.log('Successfully connected to db')
	} catch (e) {
		await client.close();
		console.error('Could not connected to db');
	}
}