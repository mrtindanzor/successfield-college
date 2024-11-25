import { Router } from "express"


const verifyroute = Router(),
      certDb = [{"name":"simon tindanzor","studentNumber":"0000000001","certificateCode":"001","studentProgramme":"business","dateCompleted":"Sun Nov 17 2024 16:07:42 GMT+0000 (Greenwich Mean Time)","_id":"1"},
        {"name":"godfred tindanzor","studentNumber":"0000000002","certificateCode":"002","studentProgramme":"nursing","dateCompleted":"Sun Nov 18 2024 16:07:42 GMT+0000 (Greenwich Mean Time)","_id":"2"},
        {"name":"simon tindanzor","studentNumber":"123456789","certificateCode":"FGH","studentProgramme":"business","dateCompleted":"Sun Nov 17 2024 16:07:42 GMT+0000 (Greenwich Mean Time)","_id":"25"}
        ]


verifyroute.get('/verify', (req, res) => res.render('index', {page: 'verify'}))
verifyroute.get('/verify/:certNumber', async (req, res) => {
  const certificateCode = req.params.certNumber.toUpperCase()
  const user = certDb.find(user => user.certificateCode === certificateCode)
    if(!user) return res.status(404).json({status: 404, msg: 'Invalid certificate code'})
    return res.status(200).json({status: 200, user})
})

export default verifyroute