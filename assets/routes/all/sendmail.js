import nodemailer from "nodemailer"
import { MAILER_PASSWORD, MAILER_USER } from "../../../app.js"

  const sendMail = async (options) => {
    return new Promise((resolve, reject) => {
      const pass = MAILER_PASSWORD,
      user = MAILER_USER,
      transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user,
          pass,
        }
      })
      transporter.sendMail(options, (err, response) => {
        if(err) return reject(err)
        return resolve(response)
      })
    })
  },
  sendMailAsync = async (subject, html, to=MAILER_USER ) => {

    const user = MAILER_USER,
    from = `SuccessField College <${user}>`,
    options = { from, to, subject, html }

    try{
      const response = await sendMail(options)
      return response
    } catch(error){
      return error
    }
  }

  export { sendMailAsync } 