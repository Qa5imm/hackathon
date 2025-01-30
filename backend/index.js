import express from "express"
import regiestRoutes from "./routes/index.js";
import reqisterMiddlewares from "./middlewares/index.js";
import dotenv from "dotenv";
import cors from "cors";


// Load environment variables
dotenv.config();

// App
const app = express();
const PORT = process.env.PORT || 3001;


const startSever = async () => {
	try {

		//cors
		app.use(cors({
			origin: 'http://localhost:3000',
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			credentials: true
		}));

		// Middlewares
		reqisterMiddlewares(app);

		// Routes 
		regiestRoutes(app);

		// Server
		app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });
	} catch (err) {

		console.error(err);
		process.exit(1);
	}
}


startSever().catch((error) => console.error("Error starting server", error))




