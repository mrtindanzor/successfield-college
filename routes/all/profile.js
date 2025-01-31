import { Router } from "express";
import { isNotAuthenticated, certificateModel } from "../../dependencies.js"

const profileRoute = Router()

profileRoute.use('/profile', isNotAuthenticated)

profileRoute.get('/profile', async function(req, res){
  const user = req.user
  const firstname = user.firstname
  const middlename = user.middlename ?? ''
  const surname = user.surname
  const name = firstname + ' ' + middlename + ' ' + surname
  const myCertificates = await certificateModel.find({studentNumber: user.studentNumber.toLowerCase()})
  res.render('index', {page: 'profile', title: `Dashboard - ${name.toLocaleUpperCase()}`, name, user, myCertificates})
})

export default profileRoute