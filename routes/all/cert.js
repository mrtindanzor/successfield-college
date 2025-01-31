import { Router } from "express"
import { sendMailAsync } from "./sendmail.js"
import mailTemplates from "./mailtemplates.js"
import { env, userModel, certificateModel, createCertificateCode } from "../../dependencies.js"
const certRoute = Router()

certRoute.get('/cert/:param', (req, res) => {
  const param = req.params.param

  if(param === 'add') return res.status(200).render('index', {page: 'cert', section: 'add', title: 'Add a certificate'})
  if(param === 'edit') return res.status(200).render('index', {page: 'cert', section: 'edit', title: 'Edit a Certificate'})
  if(param === 'delete') return res.status(200).render('index', {page: 'cert', section: 'delete', title: 'Delete Certificate'})
})

certRoute.put('/cert', async (req, res) => {
  const {programme, courseCode, studentNumber, dateCompleted} = req.body
  if(!courseCode || !programme || !studentNumber) return res.json({status: 403, msg: 'Add all essential fields'})
  const checkUser = await userModel.findOne({studentNumber: studentNumber.toLowerCase()})
  if(!checkUser) return res.json({status: 404, msg: 'No student with this student number'})
  const certificateCode = await createCertificateCode(certificateModel, courseCode)
  const name = checkUser.firstname +' '+ (checkUser.middlename ?? '') +' '+  checkUser.surname
  const certificate = { name: name.toLowerCase(), studentNumber: studentNumber.toLowerCase(), certificateCode: certificateCode.toLowerCase(), programme: programme.toLowerCase(), dateCompleted: dateCompleted?.toLowerCase() }
  const newCertificate = new certificateModel(certificate)
  newCertificate.save()
    .then( async () => {
      if(newCertificate.isNew) return res.status(400).json({status: 304, msg: 'could not add file'})
      const users = await userModel.find({admin: true}).catch(err => console.log(err))
      if(users){
        const name = certificate.name
        const studentNumber = certificate.studentNumber
        const certificateCode = certificate.certificateCode
        const certificateName = certificate.programme || ''
        const subject = 'New certificate issued to '+name.toUpperCase()
        // users.forEach(async el => {
        //     let admin = el.firstname + ' ' + el.surname
        //     if(el.firstname.toLowerCase() == 'augustine') admin = 'Dr (clin) ' + el.firstname + ' ' + el.surname
        //     const html = (new mailTemplates).newCertificateIssued(admin, name, studentNumber, certificateCode, certificateName)
        //     await sendMailAsync(subject, html, el.email)
        //   })
          }
        })
      return res.status(201).json({status: 201, msg: 'added successfully'})
    })

certRoute.patch('/cert', async (req, res) => {
  const certificate = req.body
  const name = certificate.name.toLowerCase()
  const certificateCode = certificate.certificateCode.toLowerCase()
  const oldCertificateCode = certificate.oldCertificateCode
  const programme = certificate.programme.toLowerCase()
  const studentNumber = certificate.studentNumber.toLowerCase()
  const dateCompleted = certificate.dateCompleted.toLowerCase()
  if(!name || !certificateCode || !programme || !studentNumber) return res.json({status: 403, msg: 'Add all essential fields'})
  const newCertificate = {name, certificateCode, programme, studentNumber, dateCompleted}

  const findUser = await certificateModel.findOne({certificateCode})
  if(findUser && findUser.certificateCode !== oldCertificateCode) return res.status(403).json({status: 403, msg: 'A certificate with this code already exists'})

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