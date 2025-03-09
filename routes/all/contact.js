import mailTemplates from "./mailtemplates.js";
import { Router } from "express";
import { userModel } from "../../dependencies.js";
import { sendMailAsync } from "./sendmail.js";

const contactroute = Router()

contactroute.get('/contact', (req, res) => res.render('index', {page: 'contact', title: 'Contact Successfield College'}))
contactroute.post('/contact', async (req, res) => {
  const { name, email, phone, subject, text } = req.body
  if(!name || !email || !phone || !subject || !text) return res.status(400).json({status: 400, msg: 'Fill in all the fields'})
  const html = (new mailTemplates).contactForm(name, email, phone, text),
  users = await userModel.find({admin: true}).catch(err => console.log(err))
  if(users){
    users.forEach(async el => {
      await sendMailAsync(subject, html, el.email)
    })
  }

  const sendMail = await sendMailAsync(subject, html)
  if(sendMail) if(sendMail?.accepted?.length === 1) return res.status(201).json({status: 201, msg: 'Mail sent successfully'})
  return res.status(500).json({status: 500, msg: 'An error occured'})
})

export default contactroute