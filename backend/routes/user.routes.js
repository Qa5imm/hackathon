import { Router } from "express";
import verifyToken from '../middlewares/auth.middleware.js';
import { getAllUsers, getCurrentUser, getUserById, getUserPosts } from '../controllers/user.controller.js';

const router = new Router()

router.get("/me", verifyToken, getCurrentUser)
router.get("/", verifyToken, getAllUsers)
router.get("/:id/posts", verifyToken, getUserPosts)
router.get("/:id", verifyToken, getUserById)


export default router
