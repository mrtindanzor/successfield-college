import { Router } from "express";

const adminRoute = Router(),
checkAdmin = (req, res, next) => {
  if(!req.isAdmin) return res.status(403).redirect('/')
  next()
}


adminRoute.get('/admin', checkAdmin, (req, res) => {
  res.status(200).render('index', {page: 'admin', title: 'Admin Dashboard'})
})

export default adminRoute