const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_SENDER_ADDRESS = process.env.EMAIL_SENDER_ADDRESS;
type Props = {
  email: string;
  subject: string;
  message: string;
};

const email = ({ apiKey, from }: { apiKey: string; from: string }) => {
  const sendEmail = async ({ email, subject, message }: Props) => {
    const data = {
      personalizations: [{ to: [{ email }] }],
      from: { email: from },
      subject,
      content: [{ type: "text/html", value: message }],
    };
    return fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .catch((error) => console.error("Error:", error));
  };
  return { sendEmail };
};

export default email;
