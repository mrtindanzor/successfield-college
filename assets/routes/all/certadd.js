import { Router } from "express"
import { certificateModel } from "../../../app.js"

const certaddRoute = Router(),
checkAdmin = (req, res, next) => {
  if(!req.isAdmin) return res.status(403).redirect('/unknown')
  next()
}

certaddRoute.post('/certadd', checkAdmin, async (req, res) => {
  const certificate = req.body
  
  const certificateCode = certificate.certificateCode.toLowerCase().trim(),
  user = await certificateModel.findOne({certificateCode})

  if(user) return res.status(304).json({msg: "Already added in database, input another"})

  const newCertificate = new certificateModel(certificate)

  newCertificate.save()
    .then(() => {
      if(newCertificate.isNew) return res.status(400).json({status: 304, msg: 'could not add file'})
      return res.status(201).json({status: 201, msg: 'added successfully'})
    })
})

certaddRoute.get('/certadd', checkAdmin, (req, res) => {
  res.status(200).render('index', {page: 'certadd', title: 'Add certificate'})
})

export { certaddRoute }