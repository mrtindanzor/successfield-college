import { Router } from "express";
import { isNotAuthenticated } from "../../../dependencies.js"

const profileRoute = Router()

// profileRoute.use('/profile', isNotAuthenticated)

// profileRoute.get('/profile', (req, res) => {
//   const name = req.user.firstname + ' ' + req.user.surname
//   res.render('index', {page: 'profile', title: `Dashboard - ${name.toLocaleUpperCase()}`})
// })

export default profileRoute