import { Router } from "express";

const accreditationRoute = Router()

accreditationRoute.get('/members', async (req, res) => {
  res.render('index', {page: 'member', title: 'Accredited Members'})
})

export default accreditationRoute