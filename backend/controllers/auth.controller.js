import pool from "../config/db.config.js"
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errorResponse, successResponse } from "../utils/response.js";


dotenv.config()


export const client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

export const login = async (req, res) => {
	try {
		console.log("request body", req.body)
		const { tokens } = await client.getToken(req.body.code);
		const userProfile = jwt.decode(tokens.id_token)
		console.log("userProfile", userProfile)
		let result = await pool.execute('SELECT * FROM users WHERE email = ?', [userProfile.email]);
		console.log("result", result)
		if (!result[0].length) {
			await pool.execute('INSERT INTO users (google_sub, first_name, last_name, email) VALUES (?, ?, ?, ?)', [userProfile.sub, userProfile.given_name, userProfile.family_name, userProfile.email]);
			result = await pool.execute('SELECT * FROM users WHERE email = ?', [userProfile.email]);
		}
		const user = result[0][0]
		const userInfo = { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email }
		successResponse(res, { user: userInfo, token: tokens.id_token }, 201);
	}
	catch (error) {
		errorResponse(res, error, 500);
	}
}
export const getAllUsers = async (_, res) => {
	try {
		const users = await pool.execute("SELECT * FROM users");
		successResponse(res, users[0]);
	} catch (error) {
		errorResponse(res, error, 500);
	}
}	
