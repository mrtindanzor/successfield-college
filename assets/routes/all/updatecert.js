import { Router } from "express";
import { certificateModel } from "../../../app.js";

const updatecertRoute = Router()

updatecertRoute.get('/updatecert', (req, res) => {
  res.status(200).render('index', {page: 'updatecert', title: 'Update Certificate'})
})
updatecertRoute.post('/updatecert', (req, res) => {
  const certificate = req.body,
    name = certificate.name,
    certificateCode = certificate.certificateCode,
    oldCertificateCode = certificate.oldCertificateCode,
    programme = certificate.programme,
    studentNumber = certificate.studentNumber,
    dateCompleted = certificate.dateCompleted,
    newCertificate = {name, certificateCode, programme, studentNumber, dateCompleted}
  certificateModel.findOneAndUpdate({certificateCode: oldCertificateCode}, newCertificate)
    .then( async () => {
      const user = await certificateModel.findOne({certificateCode})
      if(user) return res.json({status: 204, msg: 'Updated certificate successfully'})
      return res.status(400).json({status: 400, msg: 'Could not update certificate'})
    })
})

export default updatecertRoute