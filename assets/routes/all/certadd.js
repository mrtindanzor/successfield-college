import { Router } from "express"
import { certificateModel } from "../../../dependencies.js"
import { sendMailAsync } from "./sendmail.js"
import mailTemplates from "./mailtemplates.js"
import { env, userModel } from "../../../dependencies.js"
const certaddRoute = Router()

certaddRoute.put('/certadd', async (req, res) => {
  const certificate = req.body
  const certificateCode = certificate.certificateCode.toLowerCase().trim(),
  user = await certificateModel.findOne({certificateCode})

  if(user) return res.status(400).json({status: 400, msg: "Already added in database"})

  const newCertificate = new certificateModel(certificate)

  newCertificate.save()
    .then( async () => {
      if(newCertificate.isNew) return res.status(400).json({status: 304, msg: 'could not add file'})
      const users = await userModel.find({admin: true}).catch(err => console.log(err))
      if(users){
        const name = certificate.name || '',
            studentNumber = certificate.studentNumber || '',
            certificateCode = certificate.certificateCode || '', 
            certificateName = certificate.certificate || '',
            subject = 'New certificate issued to '+name.toUpperCase()
            users.forEach(async el => {
              const admin = el.firstname + ' ' + el.surname,
                html = (new mailTemplates).newCertificateIssued(admin, name, studentNumber, certificateCode, certificateName)
              await sendMailAsync(subject, html, el.email)
              })
            }
        })
      return res.status(201).json({status: 201, msg: 'added successfully'})
    })

certaddRoute.get('/certadd', (req, res) => {
  res.status(200).render('index', {page: 'certadd', title: 'Add a certificate'})
})

export { certaddRoute }