import { Router } from "express"
import { certificateCollection } from './certadd.js'

const verifyroute = Router()

verifyroute.get('/verify', (req, res) => res.render('index', {page: 'verify'}))
verifyroute.get('/verify/:certNumber', async (req, res) => {
  const certificateCode = req.params.certNumber.toLowerCase(),
  user = certificateCollection.findOne({certificateCode}, async (err, user) => {
    if(err) return res.status(500).json({status: 500, msg: 'An error occured'})
    return user
  })

  if(!user) return res.status(404).json({status: 404, msg: 'Invalid certificate code'})
  return res.status(200).json({status: 200, user})
})

export default verifyroute