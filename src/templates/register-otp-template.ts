const registationOtpTemplate = (otp: string) => (

  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Registration - Newsglance</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; line-height: 1.5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; margin: 0 auto;">

          <!-- Header -->
          <tr>
            <td style="background-color: #CC0000; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff; font-family: Arial, sans-serif;">newsglance</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 600; color: #000000; text-align: center; font-family: Arial, sans-serif;">Verify Your Account</h2>

              <p style="margin: 0 0 24px 0; font-size: 14px; color: #666666; text-align: center; font-family: Arial, sans-serif;">
                Enter the verification code below to complete your registration.
              </p>

              <!-- OTP Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 24px; text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 12px; color: #999999; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Verification Code</p>
                    <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #CC0000; letter-spacing: 6px;">${otp}</div>
                  </td>
                </tr>
              </table>

              <!-- Expiry Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="text-align: center; padding: 12px; background-color: #fff3cd; border: 1px solid #ffeaa7;">
                    <p style="margin: 0; font-size: 13px; color: #856404; font-weight: 500; font-family: Arial, sans-serif;">⏰ This code expires in 10 minutes</p>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="background-color: #f8f9fa; border-left: 3px solid #CC0000; padding: 16px 20px;">
                    <p style="margin: 0 0 6px 0; font-weight: 600; color: #000000; font-size: 13px; font-family: Arial, sans-serif;">🔒 Security Notice</p>
                    <p style="margin: 0; font-size: 13px; color: #666666; line-height: 1.4; font-family: Arial, sans-serif;">
                      Keep this code confidential. Never share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Help Section -->
              <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 24px; text-align: center;">
                <p style="margin: 0; font-size: 13px; color: #666666; font-family: Arial, sans-serif;">
                  Need help? <a href="mailto:newsglance@aol.com" style="color: #CC0000; text-decoration: none; font-weight: 600;">Contact support</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 16px 24px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; font-size: 11px; color: #999999; font-family: Arial, sans-serif;">
                © 2025 Newsglance. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
);

export default registationOtpTemplate;
