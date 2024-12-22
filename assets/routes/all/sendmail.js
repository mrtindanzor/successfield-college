import nodemailer from "nodemailer"
import { env } from "../../../dependencies.js"

  const pass = env.MAILER_PASSWORD,
  user = env.MAILER_USER,
  sendMail = async (options) => {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
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
  sendMailAsync = async (subject, html, to=user ) => {

    const from = `SuccessField College <${user}>`,
    options = { from, to, subject, html }

    try{
      const response = await sendMail(options)
      return response
    } catch(error){
      return error
    }
  }

  export { sendMailAsync } 