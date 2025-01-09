import { Router } from "express"
import { certificateModel } from "../../dependencies.js"

const verifyroute = Router()

verifyroute.get('/verify', (req, res) => res.render('index', {page: 'verify', title: 'Verify certificate'}))
verifyroute.post('/verify', async (req, res) => {
  const certificateCode = req.body
  if(!certificateCode) return res.status(400).json({status: 400, msg: 'No certificate code provided'})
  const user = await certificateModel.findOne(certificateCode)
  if(user) return res.status(200).json({status: 200, ...user._doc}) 
  return res.status(404).json({status: 404, msg: 'Invalid certificate code'})
})

export default verifyroute