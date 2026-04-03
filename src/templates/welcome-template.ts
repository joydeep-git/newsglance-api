const welcomeTemplate = (name: string) => (

  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Newsglance</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; line-height: 1.5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; margin: 0 auto;">

          <!-- Header -->
          <tr>
            <td style="background-color: #CC0000; padding: 28px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff; font-family: Arial, sans-serif;">newsglance</h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.8); font-family: Arial, sans-serif;">Your daily dose of news, simplified.</p>
            </td>
          </tr>

          <!-- Hero Content -->
          <tr>
            <td style="padding: 36px 24px 20px 24px; text-align: center;">
              <div style="font-size: 42px; margin-bottom: 16px;">🎉</div>
              <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 700; color: #111111; font-family: Arial, sans-serif;">Welcome aboard, ${name}!</h2>
              <p style="margin: 0 0 28px 0; font-size: 15px; color: #555555; font-family: Arial, sans-serif; line-height: 1.7;">
                Your Newsglance account has been created successfully. You're now part of a smarter way to stay informed.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 24px;">
              <div style="height: 1px; background-color: #f0f0f0;"></div>
            </td>
          </tr>

          <!-- Features -->
          <tr>
            <td style="padding: 28px 24px 8px 24px;">
              <p style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif; text-align: center;">What you get</p>

              <!-- Feature 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                <tr>
                  <td width="44" valign="top" style="padding-top: 2px;">
                    <div style="width: 36px; height: 36px; background-color: #fff0f0; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">📰</div>
                  </td>
                  <td style="padding-left: 12px;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111111; font-family: Arial, sans-serif;">Top Headlines, Daily</p>
                    <p style="margin: 2px 0 0 0; font-size: 13px; color: #777777; font-family: Arial, sans-serif;">Curated news from trusted global sources.</p>
                  </td>
                </tr>
              </table>

              <!-- Feature 2 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                <tr>
                  <td width="44" valign="top" style="padding-top: 2px;">
                    <div style="width: 36px; height: 36px; background-color: #fff0f0; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">🤖</div>
                  </td>
                  <td style="padding-left: 12px;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111111; font-family: Arial, sans-serif;">AI-Powered Summaries</p>
                    <p style="margin: 2px 0 0 0; font-size: 13px; color: #777777; font-family: Arial, sans-serif;">Get the gist of any article in seconds.</p>
                  </td>
                </tr>
              </table>

              <!-- Feature 3 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                <tr>
                  <td width="44" valign="top" style="padding-top: 2px;">
                    <div style="width: 36px; height: 36px; background-color: #fff0f0; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">🎧</div>
                  </td>
                  <td style="padding-left: 12px;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111111; font-family: Arial, sans-serif;">Audio News Briefings</p>
                    <p style="margin: 2px 0 0 0; font-size: 13px; color: #777777; font-family: Arial, sans-serif;">Listen to your news on the go.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 24px 24px 32px 24px; text-align: center;">
              <a href="https://newsglance.vercel.app" style="display: inline-block; background-color: #CC0000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 36px; font-family: Arial, sans-serif; border-radius: 4px;">Start Reading Now →</a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 24px;">
              <div style="height: 1px; background-color: #f0f0f0;"></div>
            </td>
          </tr>

          <!-- Help -->
          <tr>
            <td style="padding: 20px 24px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #888888; font-family: Arial, sans-serif;">
                Need help? <a href="mailto:newsglance@aol.com" style="color: #CC0000; text-decoration: none; font-weight: 600;">Contact support</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 16px 24px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; font-size: 11px; color: #aaaaaa; font-family: Arial, sans-serif;">
                © 2025 Newsglance. All rights reserved.<br>
                You received this email because you signed up at Newsglance.
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

export default welcomeTemplate;
