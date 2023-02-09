import nodemailer from 'nodemailer'

const transporterSettings = {
    host: "smtp.mail.ru",
    port: 587,
    secure: false,
    auth: {
        user: 'd.diubajlo@mail.ru',
        pass: process.env.MAIL_PASS
    },
}

export const emailAdapter = {

    async sendEmailForConfirmation(email: string, code: string) {

        let transporter = nodemailer.createTransport(transporterSettings)

        return await transporter.sendMail({
            from: 'd.diubajlo@mail.ru',
            to: email,
            subject: "Successful registration",
            html: "<h1>Thank for your registration</h1>\n" +
                "       <p>To finish registration please follow the link below:\n" +
                `          <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>\n` +
                "      </p>",
        })

    },
    async sendEmailForPasswordRecovery(email: string, code: string) {

        let transporter = nodemailer.createTransport(transporterSettings)

        return await transporter.sendMail({
            from: 'd.diubajlo@mail.ru',
            to: email,
            subject: "Password recovery",
            html: "<h1>Password recovery</h1>\n" +
                "       <p>To finish password recovery please follow the link below:\n" +
                `          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>\n` +
                "      </p>",
        })

    },
}