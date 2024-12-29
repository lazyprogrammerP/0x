import dotenv from "dotenv";

dotenv.config();

type IEnv = {
  PORT: number;
  JWT_SECRET: string;
};

let env: null | IEnv = null;

const loadEnv = (): IEnv => {
  if (env) return env;

  if (!process.env.PORT) throw new Error("PORT is not defined");
  const PORT = parseInt(process.env.PORT);

  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const JWT_SECRET = process.env.JWT_SECRET;

  env = { PORT, JWT_SECRET };
  return env;
};

export default loadEnv;
