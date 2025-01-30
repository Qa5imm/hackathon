import { Router } from "express"
import verifyToken from "../middlewares/auth.middleware.js"
import validatePost from "../middlewares/post.middleware.js"
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "../controllers/post.controller.js"
const router = Router()



router.get("/", verifyToken, getAllPosts)
router.get("/:id", verifyToken, getPostById)
router.post("/", verifyToken, validatePost, createPost)
router.put("/:id", verifyToken, validatePost, updatePost)
router.delete("/:id", verifyToken, deletePost)



export default router
