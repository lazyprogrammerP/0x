import loadEnv from "../../load-env";
import twilioClient from "./twilio-client";
import verifyPhoneNumber from "./verify-phone-number";

const env = loadEnv();

const makeCall = async (phoneNumber: string, agentId: number) => {
  try {
    const allowed = await verifyPhoneNumber(phoneNumber);
    if (!allowed) {
      throw new Error(
        `The number ${phoneNumber} is not recognized as a valid outgoing number or caller ID.`
      );
    }

    const call = await twilioClient.calls.create({
      from: env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
      twiml: `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://${env.TWILIO_WEBHOOK_DOMAIN}/callback/twilio/media-stream">
      <Parameter name="agentId" value="${agentId}" />
    </Stream>
  </Connect>
</Response>`,
      record: true,
    });

    return call.sid;
  } catch (error) {
    throw new Error(`Error verifying phone number: ${error}`);
  }
};

export default makeCall;
