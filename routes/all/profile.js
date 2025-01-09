import { Router } from "express";
import { isNotAuthenticated } from "../../dependencies.js"

const profileRoute = Router()

profileRoute.use('/profile', isNotAuthenticated)

profileRoute.get('/profile', (req, res) => {
  const user = req.user,
    firstname = user.firstname,
    middlename = user.middlename ? user.middlename : '',
    surname = user.surname,
    name = firstname + ' ' + middlename + ' ' + surname
  res.render('index', {page: 'profile', title: `Dashboard - ${name.toLocaleUpperCase()}`, name, user})
})

export default profileRoute