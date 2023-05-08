import nodemailer from "nodemailer";

type messageOptType = {
    from?: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
};

//----------------------update to use HOST AND PORT

export const sendEmail = async (messageOpt: messageOptType) => {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USERNAME,
            pass: EMAIL_PASSWORD,
        },
    });

    let message = {
        from: `"Sample App" <${EMAIL_USERNAME}>`,
        ...messageOpt,
    };
    try {
        await transporter.sendMail(message);
        return {
            status: "success",
            message: "email is sent successfully",
        };
    } catch (err) {
        return {
            status: "failed",
            message: JSON.stringify(err),
        };
    }
};
