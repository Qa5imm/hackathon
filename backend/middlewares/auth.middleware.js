import { client } from "../controllers/auth.controller.js";
import dotenv from "dotenv";
import { errorResponse } from "../utils/response.js";
import pool from "../config/db.config.js";
dotenv.config();


const verifyToken = async (req, res, next) => {
	try {
		console.log("auth middleware")
		const auth = req.header("Authorization");
		if (!auth) {
			throw new Error("no auth header");
		}
		const token = auth.split("Bearer ")[1];
		if (token === "null") {
			throw new Error("token not found");
		}
		const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
		const payload = ticket.getPayload()
		if (!payload) {
			throw new Error("payload not found");
		}
		const user = await pool.execute('SELECT * FROM users WHERE google_sub = ?', [payload.sub]);
		req.user = {
			id: user[0][0].id
		}
		console.log("user", req.user)
		next();
	} catch (error) {
		errorResponse(res, error, 401)
	}
}


export default verifyToken;
