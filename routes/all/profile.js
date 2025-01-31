import { Router } from "express";
import { isNotAuthenticated, certificateModel } from "../../dependencies.js"

const profileRoute = Router()

profileRoute.use('/profile', isNotAuthenticated)

profileRoute.get('/profile', (req, res) => {
  const user = req.user,
    firstname = user.firstname,
    middlename = user.middlename ? user.middlename : '',
    surname = user.surname,
    name = firstname + ' ' + middlename + ' ' + surname,
    myCertificates = certificateModel.find({studentNumber: req.user?.studentNumber})
  res.render('index', {page: 'profile', title: `Dashboard - ${name.toLocaleUpperCase()}`, name, user, myCertificates})
})

export default profileRoute