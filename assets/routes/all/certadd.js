import { Router } from "express"
import { certificateModel } from "../../../app.js"

const certaddRoute = Router()

certaddRoute.put('/certadd', async (req, res) => {
  const certificate = req.body
  
  const certificateCode = certificate.certificateCode.toLowerCase().trim(),
  user = await certificateModel.findOne({certificateCode})

  if(user) return res.status(400).json({status: 400, msg: "Already added in database"})

  const newCertificate = new certificateModel(certificate)

  newCertificate.save()
    .then(() => {
      if(newCertificate.isNew) return res.status(400).json({status: 304, msg: 'could not add file'})
      return res.status(201).json({status: 201, msg: 'added successfully'})
    })
})

certaddRoute.get('/certadd', (req, res) => {
  res.status(200).render('index', {page: 'certadd', title: 'Add a certificate'})
})

export { certaddRoute }