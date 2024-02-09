const nodemailer = require('nodemailer');

module.exports = async(email, subject, text, html) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            PORT: process.env.EMAIL_PORT,
            secure: Boolean(process.env.SECURE),
            auth:{
                user: process.env.USER,
                pass: process.env.APP_PASS
            }
        });

        await transporter.sendMail({
            from: '"PolyLove Team" <nmace44@gmail.com>', 
            to: email,
            subject: subject,
            text: text,
            html: html
        });
        console.log("Email sent succesfully");
    }
    catch (error) {
        console.log("Email not sent: " + error);
    }
}