// const { SendEmailCommand } = require("@aws-sdk/client-ses");
// const { sesClient } = require("./sesClient.js");

// const generateEmailContent = ({ type, fromName, toName, verifyUrl }) => {
//   if (type === "interested") {
//     return {
//       subject: `${fromName} is interested in you! ❤️`,
//       html: `<h1>Hey ${toName}!</h1><p><strong>${fromName}</strong> has sent you a connection request on DevTinder. Check it out!</p>`,
//       text: `${fromName} is interested in you. Visit DevTinder to respond!`,
//     };
//   }

//   if (type === "accepted") {
//     return {
//       subject: `${toName} accepted your request! 🎉`,
//       html: `<h1>Good news, ${fromName}!</h1><p><strong>${toName}</strong> has accepted your connection request. Start chatting now!</p>`,
//       text: `${toName} accepted your connection request. Check DevTinder!`,
//     };
//   }

//   if (type === "verify") {
//     return {
//       subject: "Verify your email for DevTinder",
//       html: `<h2>Hi ${toName},</h2><p>Click the button below to verify your email address:</p>
//              <p><a href="${verifyUrl}" style="padding:10px 15px; background-color:#007bff; color:white; text-decoration:none; border-radius:5px;">Verify Email</a></p>
//              <p>If the button doesn't work, click or paste this link:<br/>${verifyUrl}</p>`,
//       text: `Hi ${toName}, please verify your email by visiting: ${verifyUrl}`,
//     };
//   }

//   return {
//     subject: "DevTinder Notification",
//     html: "<p>New notification from DevTinder.</p>",
//     text: "You have a new notification.",
//   };
// };

// const run = async ({ toAddress, type, fromName, toName, verifyUrl }) => {
//   const { subject, html, text } = generateEmailContent({ type, fromName, toName, verifyUrl });

//   const sendEmailCommand = new SendEmailCommand({
//     Destination: { ToAddresses: [toAddress] },
//     Message: {
//       Body: {
//         Html: { Charset: "UTF-8", Data: html },
//         Text: { Charset: "UTF-8", Data: text },
//       },
//       Subject: { Charset: "UTF-8", Data: subject },
//     },
//     Source: "nitesh@tinderdev.xyz", // ✅ Replace with verified sender
//   });

//   try {
//     const response = await sesClient.send(sendEmailCommand);
//     console.log("✅ Email sent:", response);
//     return response;
//   } catch (err) {
//     console.error("❌ Email error:", err.message);
//     throw err;
//   }
// };

// module.exports = { run };
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// 👇 Handles all email content generation based on `type`
const generateEmailContent = ({ type, fromName, toName, verifyUrl }) => {
  switch (type) {
    case "verify":
      return {
        subject: "Verify your email for DevTinder",
        html: `
          <h2>Hi ${toName},</h2>
          <p>Thank you for signing up on <strong>${fromName}</strong>.</p>
          <p>Click the button below to verify your email:</p>
          <p>
            <a href="${verifyUrl}" style="padding:10px 15px; background-color:#007bff; color:white; text-decoration:none; border-radius:5px;">
              Verify Email
            </a>
          </p>
          <p>If the button doesn't work, use this link:<br/>${verifyUrl}</p>
        `,
      };

    case "interested":
      return {
        subject: `${fromName} is interested in you! ❤️`,
        html: `
          <h2>Hey ${toName},</h2>
          <p><strong>${fromName}</strong> is interested in you on <strong>DevTinder</strong>!</p>
          <p>Go check them out and respond to their request.</p>
          <p><a href="https://tinderdev.xyz" target="_blank">Open DevTinder</a></p>
        `,
      };

    case "accepted":
      return {
        subject: `${toName} accepted your request! 🎉`,
        html: `
          <h2>Hey ${fromName},</h2>
          <p><strong>${toName}</strong> accepted your connection request on DevTinder!</p>
          <p>You can now start chatting!</p>
        `,
      };

    default:
      return {
        subject: "DevTinder Notification",
        html: `<p>You have a new notification on DevTinder.</p>`,
      };
  }
};

// ✅ Main function to send email using Resend
const run = async ({ toAddress, fromName = "DevTinder", toName, type, verifyUrl }) => {
  const { subject, html } = generateEmailContent({ type, fromName, toName, verifyUrl });

  try {
    const response = await resend.emails.send({
      from: "DevTinder <onboarding@tinderdev.xyz>", // ✅ Use your verified domain
      to: toAddress,
      subject,
      html,
    });

    // console.log("✅ Email sent via Resend:", response);
    return response;
  } catch (err) {
    // console.error("❌ Failed to send email via Resend:", err.message);
    throw new Error("Failed to send email.");
  }
};

module.exports = { run };

