import { Router } from "express";

const accreditationRoute = Router()

accreditationRoute.get('/member', async (req, res) => {
  res.render('index', {page: 'member', title: 'Accredited Members'})
})

export default accreditationRoute