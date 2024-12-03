import { Router } from "express";
import { certificateModel } from "../../../app.js";

const updatecertRoute = Router(),
checkAdmin = (req, res, next) => {
  if(!req.isAdmin) return res.status(403).redirect('/unknown')
  next()
}

updatecertRoute.get('/updatecert', checkAdmin, (req, res) => {
  res.status(200).render('index', {page: 'updatecert', title: 'Update Certificate'})
})
updatecertRoute.post('/updatecert', checkAdmin, async (req, res) => {
  const certificate = req.body,
    name = certificate.name.toLowerCase(),
    certificateCode = certificate.certificateCode.toLowerCase(),
    oldCertificateCode = certificate.oldCertificateCode,
    programme = certificate.programme.toLowerCase(),
    studentNumber = certificate.studentNumber.toLowerCase(),
    dateCompleted = certificate.dateCompleted.toLowerCase(),
    newCertificate = {name, certificateCode, programme, studentNumber, dateCompleted}

  const findUser = await certificateModel.findOne({certificateCode})
  if(findUser && findUser.certificateCode !== certificateCode) return res.status(403).json({status: 403, msg: 'A user with this certificate code already exist'})

  certificateModel.findOneAndUpdate({certificateCode: oldCertificateCode}, newCertificate)
    .then( async () => {
      const user = await certificateModel.findOne({certificateCode})
      if(user) return res.json({status: 204, msg: 'Updated certificate successfully'})
      return res.status(400).json({status: 400, msg: 'Could not update certificate'})
    })
})

export default updatecertRoute