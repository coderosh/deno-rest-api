import {
  setExpiration,
  Payload,
  Jose,
  validateJwt,
  makeJwt,
} from "../dependencies.ts";

const key = Deno.env.get("JWT_SECRET") || "secret-key";

const header: Jose = {
  alg: "HS256",
  typ: "JWT",
};

const createToken = (id: string) => {
  const payload: Payload = {
    iss: id,
    exp: setExpiration(new Date().getTime() + 60000), // 1min
  };

  return makeJwt({ header, payload, key });
};

const verifyToken = async (jwt: string) => {
  return await validateJwt(jwt, key, { isThrowing: false });
};

export { createToken, verifyToken };
