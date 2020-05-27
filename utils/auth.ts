import { RouterContext } from "../dependencies.ts";
import { verifyToken } from "./djwt.ts";

const auth = async (ctx: RouterContext, next: any) => {
  try {
    const headers: any = ctx.request.headers;
    const authToken: string = headers.get("authorization");
    if (!authToken) {
      ctx.response.status = 403;
      ctx.response.body = { success: false, error: "You are not authorized" };
    }

    const dep = await verifyToken(authToken.replace("Bearer ", ""));

    if (!dep) {
      ctx.response.status = 403;
      ctx.response.body = { success: false, error: "You are not authorized" };
      return;
    }

    ctx.request.headers.set("id", dep.payload?.iss!);
    await next();
  } catch (e) {
    ctx.response.status = 403;
    ctx.response.body = { success: false, error: "You are not authorized" };
    return;
  }
};

export { auth };
