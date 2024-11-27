import { Router } from "express"


const verifyroute = Router(),
      certDb = [{"name":"Thomas Sichone","studentNumber":"608457/10/1","certificateCode":"gism-24-049","studentProgramme":"Doctor of Business Administration","dateCompleted":"4th July, 2024","_id":"1"},
        {"name":"Jacob Sichone","studentNumber":"608456/10/1","certificateCode":"gism-24-085","studentProgramme":"Doctor of Business Administration","dateCompleted":"4th July, 2024","_id":"2"},
        {"name":"simon Sichone","studentNumber":"608456/10/1","certificateCode":"gism-gcbt-24-085","studentProgramme":"Doctor of Business Administration","dateCompleted":"4th July, 2024","_id":"2"}
        ]


verifyroute.get('/verify', (req, res) => res.render('index', {page: 'verify'}))
verifyroute.get('/verify/:certNumber', async (req, res) => {
  const certificateCode = req.params.certNumber.toLowerCase()
  const user = certDb.find(user => user.certificateCode === certificateCode)
    if(!user) return res.status(404).json({status: 404, msg: 'Invalid certificate code'})
    return res.status(200).json({status: 200, user})
})

export default verifyroute