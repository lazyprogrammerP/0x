import dotenv from "dotenv";

dotenv.config();

type IEnv = {
  PORT: number;
  JWT_SECRET: string;

  OPENAI_API_KEY: string;

  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
  TWILIO_WEBHOOK_DOMAIN: string;
};

let env: null | IEnv = null;

const loadEnv = (): IEnv => {
  if (env) return env;

  if (!process.env.PORT) throw new Error("PORT is not defined");
  const PORT = parseInt(process.env.PORT);

  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!process.env.OPENAI_API_KEY)
    throw new Error("OPENAI_API_KEY is not defined");
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!process.env.TWILIO_ACCOUNT_SID)
    throw new Error("TWILIO_ACCOUNT_SID is not defined");
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;

  if (!process.env.TWILIO_AUTH_TOKEN)
    throw new Error("TWILIO_AUTH_TOKEN is not defined");
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

  if (!process.env.TWILIO_PHONE_NUMBER)
    throw new Error("TWILIO_PHONE_NUMBER is not defined");
  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

  if (!process.env.TWILIO_WEBHOOK_DOMAIN)
    throw new Error("TWILIO_WEBHOOK_DOMAIN is not defined");
  const TWILIO_WEBHOOK_DOMAIN = process.env.TWILIO_WEBHOOK_DOMAIN;

  env = {
    PORT,
    JWT_SECRET,
    OPENAI_API_KEY,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    TWILIO_WEBHOOK_DOMAIN,
  };
  return env;
};

export default loadEnv;
