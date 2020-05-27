import { Router } from "../dependencies.ts";
import {
  findAll,
  findById,
  createUser,
  updateUser,
  login,
} from "../controllers/user.ts";
import { auth } from "../utils/auth.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Hello World";
});

router
  .get("/users", findAll)
  .get("/user/:id", findById)
  .post("/users", createUser)
  .put("/user", auth, updateUser)
  .post("/login", login);

export default router;
