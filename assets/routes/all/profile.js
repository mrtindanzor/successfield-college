import { Router } from "express";
import { isNotAuthenticated } from "../../../dependencies.js"

const profileRoute = Router()

profileRoute.use('/profile', isNotAuthenticated)

profileRoute.get('/profile', (req, res) => {
  const firstname = req.user.firstname,
    middlename = req.user.middlename ? req.user.middlename : '',
    surname = req.user.surname,
    name = firstname + ' ' + middlename + ' ' + surname
  res.render('index', {page: 'profile', title: `Dashboard - ${name.toLocaleUpperCase()}`, name})
})


export default profileRoute