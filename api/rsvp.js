// Vercel API route removed: RSVP submissions are handled entirely on the client side.
// All server-side email sending logic (Resend, Formspree, SMTP, Nodemailer) has been completely removed.

export default async function handler(req, res) {
  return res.status(200).json({
    success: true,
    message: 'RSVP logic is now handled 100% client-side with an instant confirmation receipt.'
  });
}
