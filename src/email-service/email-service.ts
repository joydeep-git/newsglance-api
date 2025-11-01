import nodemailer, { Transporter } from "nodemailer";
import { EmailSendResponse } from "../types";
import { OtpType } from "../types/auth-types";
import registationOtpTemplate from "../templates/register-otp-template";
import generalOtpTemplate from "../templates/general-otp-template";
import loginOtpTemplate from "../templates/login-otp-template";
import deleteAccOtpTemplate from "../templates/delete-acc-otp-template";
import forgetPassOtpTemplate from "../templates/forget-password-otp-template";


class EmailVerificationService {

  private transporter: Transporter;

  private title = {
    "login": "Login - Newsglance",
    "register": "Account Registration - Newsglance",
    "forget-password": "Reset password - Newsglance",
    "delete-account": "Delete account - Newsglance"
  }

  private emailTemplate = (type: OtpType, otp: string): string => {

    switch (type) {

      case "login":
        return loginOtpTemplate(otp);

      case "register":
        return registationOtpTemplate(otp);

      case "delete-account":
        return deleteAccOtpTemplate(otp);

      case "forget-password":
        return forgetPassOtpTemplate(otp);

      default:
        return generalOtpTemplate(otp);
    }
  }

  constructor() {

    this.transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

  }


  public async sendOtp({ email, otp, type }: { email: string; otp: string; type: OtpType; }): Promise<EmailSendResponse> {

    try {

      return await this.transporter.sendMail({
        from: `Newsglance <${process.env.BREVO_FROM}>`,
        to: email,
        subject: this.title[type] ?? "Newsglance Email Verification",
        html: this.emailTemplate(type, otp),
      });

    } catch (err) {
      throw err;
    }

  }

}


const emailVerificationService = new EmailVerificationService();
export default emailVerificationService;