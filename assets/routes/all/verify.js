import { Router } from "express"
import { certificateModel } from "../../../app.js"

const verifyroute = Router()

verifyroute.get('/verify', (req, res) => res.render('index', {page: 'verify'}))
verifyroute.get('/verify/:certNumber', async (req, res) => {
  const certificateCode = req.params.certNumber,
    user = await certificateModel.findOne({certificateCode})
  if(!user) return res.status(404).json({status: 404, msg: 'Invalid certificate code'})
  return res.status(200).json({status: 200, user})
})

export default verifyroute