import twilio from "twilio";
import loadEnv from "../../load-env";

const env = loadEnv();

const twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export default twilioClient;
