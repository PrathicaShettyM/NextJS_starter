// domain.com/verifytoken/tokenvalue12345 => good when we are doing everything from the server component
// domain.com/verifytoken?token=tokenvalue12345 => good when we are doing everything from the server component

import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        // create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        
        // 2 cases to send email:
        // 1. when we want to verify the user
        // 2. when the user is asking for the password reset
        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, 
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            );
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, 
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }
            );
        } 

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
            }
        });

        // create the email
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email"
                 : "reset your password"}
                 or copy paste the link below in your browser. <br>
                 ${process.env.DOMAIN}/verifyemail?token=${hashedToken}"
                 </p>`
        }
        
        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}


