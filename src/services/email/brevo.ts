import nodemailer, { Transporter } from "nodemailer";
import { ContactUsDataType, EmailSendResponse } from "../../types/index.js";
import { OtpType } from "../../types/auth.js";
import registationOtpTemplate from "../../templates/register-otp-template.js";
import generalOtpTemplate from "../../templates/general-otp-template.js";
import loginOtpTemplate from "../../templates/login-otp-template.js";
import deleteAccOtpTemplate from "../../templates/delete-acc-otp-template.js";
import forgetPassOtpTemplate from "../../templates/forget-password-otp-template.js";
import welcomeTemplate from "../../templates/welcome-template.js";
import contactUsTemplate from "../../templates/contact-us-template.js";


class BrevoEmailService {

  private transporter: Transporter;

  private title = {
    "login": "Login - Newsglance",
    "register": "Account Registration - Newsglance",
    "forget-password": "Reset password - Newsglance",
    "delete-account": "Delete account - Newsglance"
  }

  private companyEmail: string = process.env.BREVO_FROM!;

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


  public async sendWelcomeEmail(email: string, name: string) {

    return await this.transporter.sendMail({
      from: `Newsglance <${this.companyEmail}>`,
      to: email,
      subject: "Welcome to Newsglance 🎉",
      html: welcomeTemplate(name),
    });

  }


  // contact us page user questions
  public async contactMeEmail(body: ContactUsDataType) {

    try {
      return await this.transporter.sendMail({
        from: `Newsglance <${this.companyEmail}>`,
        to: "joydeepdas@zohomail.com",
        replyTo: body.email,
        subject: `[Contact Us] ${body.subject} - Newsglance`,
        html: contactUsTemplate(body),
      });

    } catch (err) {
      throw err;
    }
  }

}


const emailService = new BrevoEmailService();
export default emailService;