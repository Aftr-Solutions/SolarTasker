const nodemailer = require("nodemailer");
const RESPONSE = require("../GlobalResponse/RESPONSE");

module.exports = function sendUserCredentials(email, username, password, req, res) {
    try {
        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            host: "mail.solarcleaner.pk",
            port: 465,
            secure: true,
            auth: {
                user: "support@solarcleaner.pk",
                pass: "Shahroz$$$$000"
            }
        });

        // Create email options
        const mailOptions = {
            from: "support@solarcleaner.pk",
            to: email,
            subject: "Your Account Credentials",
            html: `
                <p>Dear <strong>${username}</strong>,</p>
                <p>Your account has been successfully created. Below are your login details:</p>
                <p><strong>Username:</strong> ${username}<br>
                   <strong>Password:</strong> ${password}</p>
                <p>Please use these credentials to log in to the system. Make sure to change your password after your first login for security purposes.</p>
                <p>If you have any questions or concerns, please contact your administrator.</p>
                <p>Best regards,<br>Admin Team</p>
            ` // HTML body of the email
        };

        // Send the email
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.error("Error sending email:", err);
                return res.status(500).send(RESPONSE(false, "Error sending email", err));
            } else {
                console.log("Email sent successfully:", data.response);
                return res.status(200).send(RESPONSE(true, "Email sent successfully", {}));
            }
        });
    } catch (err) {
        console.error("Catch Error (Email Error):", err);
        return res.status(500).send(RESPONSE(false, "Unexpected error while sending email", err));
    }
};
