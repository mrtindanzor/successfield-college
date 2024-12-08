import { Router } from "express";
import { certificateModel } from "../../../app.js";

const deletecertRoute = Router()

deletecertRoute.get('/deletecertificate', (req, res) => {
  return res.status(200).render('index', {page: 'deletecert', title: 'Delete Certificate'})
})

deletecertRoute.post('/deletecertificate', async (req, res) => {
  const certificateCode = req.body.certificateCode.toLowerCase().trim()
  if(!certificateCode) return res.status(400).json({status: 400, msg: 'Enter a valid certificate code'})

  const delcertificateCode = await certificateModel.findOneAndDelete({certificateCode})
  if(!delcertificateCode) return res.status(500).json({status: 500, msg: 'An error occured while trying to delete certificate'})
  return res.status(200).json({status: 200, msg: "Certificate deleted"})
})

export default deletecertRoute