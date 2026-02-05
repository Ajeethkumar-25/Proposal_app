const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { recipient_name, recipient_email, sender_name, sender_email, template, letter } = JSON.parse(event.body);

    // Validate required fields
    if (!recipient_name || !recipient_email || !sender_name || !sender_email || !letter) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Check if email credentials are configured
    if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASSWORD) {
      console.log('Email not configured - logging letter instead');
      console.log(`Love letter from ${sender_name} to ${recipient_name} (${recipient_email}):\n${letter}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true,
          message: 'Letter saved (email not configured)',
          email_sent: false
        })
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
      }
    });

    // HTML email template
    const htmlContent = `
      <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.8; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
            <div style="background: white; padding: 30px; border-radius: 10px;">
              <h2 style="color: #667eea; text-align: center;">Dear ${recipient_name},</h2>
              <div style="white-space: pre-wrap; font-size: 1.05rem; color: #555;">
${letter}
              </div>
              <p style="text-align: center; margin-top: 30px; color: #999; font-size: 0.9rem;">
                ✨ Sent with love from proposal app ✨
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: recipient_email,
      subject: `💌 A Special Message from ${sender_name}`,
      html: htmlContent,
      text: `Dear ${recipient_name},\n\n${letter}\n\nSent with love from proposal app`
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Love letter sent successfully!',
        email_sent: true
      })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Error sending email'
      })
    };
  }
};
