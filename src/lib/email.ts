// const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
// const EMAIL_SENDER_ADDRESS = import.meta.env.EMAIL_SENDER_ADDRESS;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_SENDER_ADDRESS = process.env.EMAIL_SENDER_ADDRESS;
type Props = {
  email: string;
  subject: string;
  message: string;
};
export const sendEmail = async ({ email, subject, message }: Props) => {
  const data = {
    personalizations: [{ to: [{ email }] }],
    from: { email: EMAIL_SENDER_ADDRESS },
    subject,
    content: [{ type: "text/html", value: message }],
  };
  return fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .catch((error) => console.error("Error:", error));
};