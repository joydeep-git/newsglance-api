import { ContactUsDataType } from "@/types";

const contactUsTemplate = (body: ContactUsDataType) => (

  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Us Message - Newsglance</title>
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

          <!-- Title -->
          <tr>
            <td style="padding: 28px 24px 12px 24px; text-align: center;">
              <div style="font-size: 36px; margin-bottom: 12px;">📬</div>
              <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700; color: #111111; font-family: Arial, sans-serif;">New Contact Message</h2>
              <p style="margin: 0; font-size: 13px; color: #888888; font-family: Arial, sans-serif;">Someone reached out via the Contact Us page.</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 16px 24px 0 24px;">
              <div style="height: 1px; background-color: #f0f0f0;"></div>
            </td>
          </tr>

          <!-- Data Fields -->
          <tr>
            <td style="padding: 20px 24px;">

              <!-- Name -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
                <tr>
                  <td style="background-color: #f8f9fa; border-left: 3px solid #CC0000; padding: 14px 16px;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #CC0000; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Name</p>
                    <p style="margin: 0; font-size: 15px; color: #111111; font-weight: 600; font-family: Arial, sans-serif;">${body.name}</p>
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
                <tr>
                  <td style="background-color: #f8f9fa; border-left: 3px solid #CC0000; padding: 14px 16px;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #CC0000; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Email</p>
                    <p style="margin: 0; font-size: 15px; color: #111111; font-family: Arial, sans-serif;">
                      <a href="mailto:${body.email}" style="color: #CC0000; text-decoration: none;">${body.email}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
                <tr>
                  <td style="background-color: #f8f9fa; border-left: 3px solid #CC0000; padding: 14px 16px;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #CC0000; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Subject</p>
                    <p style="margin: 0; font-size: 15px; color: #111111; font-weight: 600; font-family: Arial, sans-serif;">${body.subject}</p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
                <tr>
                  <td style="background-color: #f8f9fa; border-left: 3px solid #CC0000; padding: 14px 16px;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #CC0000; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Message</p>
                    <p style="margin: 0; font-size: 14px; color: #444444; font-family: Arial, sans-serif; line-height: 1.7; white-space: pre-wrap;">${body.message}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding: 4px 24px 28px 24px; text-align: center;">
              <a href="mailto:${body.email}?subject=Re: ${body.subject}" style="display: inline-block; background-color: #CC0000; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; font-family: Arial, sans-serif; border-radius: 4px;">Reply to ${body.name} →</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 16px 24px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; font-size: 11px; color: #aaaaaa; font-family: Arial, sans-serif;">
                © 2025 Newsglance. This is an automated notification from your Contact Us page.
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

export default contactUsTemplate;
