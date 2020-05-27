import { Application } from "./dependencies.ts";
import "https://deno.land/x/denv/mod.ts";

import userRouter from "./routes/user.ts";
import postRouter from "./routes/post.ts";

const app = new Application();

app.use(userRouter.routes());
app.use(postRouter.routes());

app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = { success: false, error: "Endpoint not found" };
});

app.listen({ port: 8000 });
