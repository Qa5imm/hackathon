import authRoute from "./auth.routes.js";
import userRoute from "./user.routes.js";
import postRoute from "./post.routes.js";
import fileRoutes from "./file.routes.js";

const basePath = "/api";
const registerRoutes = (app) => {
	app.use(`${basePath}/auth`, authRoute);
	app.use(`${basePath}/users`, userRoute);
	app.use(`${basePath}/posts`, postRoute);
	app.use(`${basePath}/files`, fileRoutes);
}


export default registerRoutes;
