import { Router } from "express";

const adminRoute = Router()


adminRoute.get('/admin', (req, res) => {
  res.status(200).render('index', {page: 'admin', title: 'Admin Dashboard'})
})

export default adminRoute