import { Router } from '../dependencies.ts'

import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost,
} from '../controllers/post.ts'
import { auth } from '../utils/auth.ts'

const router = new Router()

router
  .get('/posts', getAllPosts)
  .get('/post/:id', getSinglePost)
  .post('/posts',auth, createPost)
  .put('/post/:id',auth, updatePost)
  .delete('/post/:id',auth, deletePost)

export default router
