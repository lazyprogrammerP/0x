import twilioClient from "./twilio-client";

const verifyPhoneNumber = async (phoneNumber: string) => {
  try {
    const icNumbers = await twilioClient.incomingPhoneNumbers.list({
      phoneNumber: phoneNumber,
    });
    if (icNumbers.length > 0) return true;

    const ocNumbers = await twilioClient.outgoingCallerIds.list({
      phoneNumber: phoneNumber,
    });
    if (ocNumbers.length > 0) return true;

    return false;
  } catch (error) {
    throw new Error(`Error verifying phone number validity: ${error}`);
  }
};

export default verifyPhoneNumber;
