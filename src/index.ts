import {app} from "./app.js";
import {runDb} from "./repository/db.js";

const port = process.env.PORT || 3000;

const startApp = async () => {
	// await runDb();
	app.listen(port, () => {
		console.log(`The app listening on port ${port}`)
	});
};

startApp();