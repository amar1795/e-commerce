import mailgun from "mailgun-js";

const mailgunClient = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

export async function sendEmail({
  to,
  from,
  subject,
  message,
  last_name,
  first_name,
}) {
  const emailData = {
    from,
    to,
    subject,
    text: message,
    template: "account creation",
    "h:X-Mailgun-Variables": JSON.stringify({
      first_name: first_name,
      last_name: last_name,
    }),
  };

  try {
    const result = await mailgunClient.messages().send(emailData);
    console.log("Email sent successfully!");
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

interface ForgotPasswordParams {
  first_name: string|null;
  senders_email: string;
  from_email: string;
  subject: string;
  token: string;
  resetlink: string;
}

// ${process.env.MAIN_DOMAIN}/password-reset


export async function ForgotPassword({
  first_name,
  senders_email,
  from_email,
  subject,
  token,
  resetlink,
}: ForgotPasswordParams) {
  const emailData = {
    from: from_email,
    to: senders_email,
    subject: subject,
    template: "password recovery",
    "h:X-Mailgun-Variables": JSON.stringify({
      token ,resetlink,first_name
    }),
  };

  try {
    const result = await mailgunClient.messages().send(emailData);
    console.log("Email sent successfully!");
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

interface PasswordChangedParams {
  first_name: string|null;
  senders_email: string;
  from_email: string;
  subject: string;
  
}

export async function PasswordChanged({
  first_name,
  senders_email,
  from_email,
  subject,
  
}: PasswordChangedParams) {
  const emailData = {
    from: from_email,
    to: senders_email,
    subject: subject,
    template: "password change successfull",
    "h:X-Mailgun-Variables": JSON.stringify({
       first_name
    }),
  };

  try {
    const result = await mailgunClient.messages().send(emailData);
    console.log("Email sent successfully!");
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}


export async function TwoFactorMailgunEmail({
  first_name,
  senders_email,
  from_email,
  subject,
  token,
  
}: any) {
  const emailData = {
    from: from_email,
    to: senders_email,
    subject: subject,
    token:token,
    template: "two factor auth",
    "h:X-Mailgun-Variables": JSON.stringify({
       first_name,token
    }),
  };

  try {
    const result = await mailgunClient.messages().send(emailData);
    console.log("Email sent successfully!");
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}