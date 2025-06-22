const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>This is an HTML Email</h1><p>Sent via AWS SES using Node.js</p>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the plain text version of the email.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Hello from AWS SES!",
      },
    },
    Source: fromAddress,
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "niteshkmrprajapati298@gmail.com",    // ✅ Verified recipient
    "nitesh@tinderdev.xyz"              // ✅ Verified sender/domain
  );

  try {
    const response = await sesClient.send(sendEmailCommand);
    console.log("Email sent:", response);
    return response;
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      console.error("Message Rejected:", caught.message);
      return caught;
    }
    throw caught;
  }
};

module.exports = { run };

// Optional: To test this directly
// run().then(console.log).catch(console.error);
