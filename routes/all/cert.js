import { Router } from "express"
import { sendMailAsync } from "./sendmail.js"
import mailTemplates from "./mailtemplates.js"
import { env, userModel, certificateModel } from "../../dependencies.js"
const certRoute = Router()

certRoute.get('/cert/:param', (req, res) => {
  const param = req.params.param

  if(param === 'add') return res.status(200).render('index', {page: 'cert', section: 'add', title: 'Add a certificate'})
  if(param === 'edit') return res.status(200).render('index', {page: 'cert', section: 'edit', title: 'Edit a Certificate'})
  if(param === 'delete') return res.status(200).render('index', {page: 'cert', section: 'delete', title: 'Delete Certificate'})
})

certRoute.put('/cert', async (req, res) => {
  const certificate = req.body
  if(!certificate.certificateCode) return res.status(400).json({status: 400, msg: "Enter valid details"})
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
            certificateName = certificate.programme || '',
            subject = 'New certificate issued to '+name.toUpperCase()
            users.forEach(async el => {
              let admin = el.firstname + ' ' + el.surname
              if(el.firstname.toLowerCase() == 'augustine') admin = 'Dr (clin) ' + el.firstname + ' ' + el.surname
              const html = (new mailTemplates).newCertificateIssued(admin, name, studentNumber, certificateCode, certificateName)
              await sendMailAsync(subject, html, el.email)
              })
            }
        })
      return res.status(201).json({status: 201, msg: 'added successfully'})
    })

certRoute.patch('/cert', async (req, res) => {
  const certificate = req.body,
    name = certificate.name.toLowerCase(),
    certificateCode = certificate.certificateCode.toLowerCase(),
    oldCertificateCode = certificate.oldCertificateCode,
    programme = certificate.programme.toLowerCase(),
    studentNumber = certificate.studentNumber.toLowerCase(),
    dateCompleted = certificate.dateCompleted.toLowerCase(),
    id = certificate.id,
    newCertificate = {name, certificateCode, programme, studentNumber, dateCompleted}

  const findUser = await certificateModel.findOne({certificateCode})
  if(findUser && findUser.id !== id) return res.status(403).json({status: 403, msg: 'A user with this certificate code already exist'})

  certificateModel.findOneAndUpdate({certificateCode: oldCertificateCode}, newCertificate, {new: true})
    .then( async (result) => {
      if(result) return res.json({status: 204, msg: 'Edited certificate successfully'})
      return res.status(400).json({status: 400, msg: 'Could not edit certificate'})
    })
})

certRoute.delete('/cert', async (req, res) => {
  const certificateCode = req.body.certificateCode.toLowerCase().trim()
  if(!certificateCode) return res.status(400).json({status: 400, msg: 'Enter a valid certificate code'})

  const delcertificateCode = await certificateModel.findOneAndDelete({certificateCode})
  if(!delcertificateCode) return res.status(500).json({status: 500, msg: 'An error occured while trying to delete certificate'})
  return res.status(200).json({status: 200, msg: "Certificate deleted"})
})

export default certRoute