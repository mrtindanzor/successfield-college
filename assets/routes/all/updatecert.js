import { Router } from "express";
import { certificateModel } from "../../../app.js";

const updatecertRoute = Router()

updatecertRoute.get('/updatecert', (req, res) => {
  res.status(200).render('index', {page: 'updatecert', title: 'Edit a Certificate'})
})
updatecertRoute.post('/updatecert', async (req, res) => {
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

export default updatecertRoute