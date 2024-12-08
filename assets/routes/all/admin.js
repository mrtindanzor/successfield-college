import { Router } from "express";
import { certaddRoute } from "./certadd.js";
import updatecertRoute from "./updatecert.js";
import addcourseRoute from "./addcourse.js";
import editcourseRoute from "./editcourse.js";
import deletecertRoute from "./deletecert.js"
import deletecourseRoute from "./deletecourse.js"

const adminRoute = Router(),
isAdmin = (req, res, next) => {
  if(!req.isAdmin) return res.status(403).redirect('/')
  next()
}

adminRoute.use('/admin', isAdmin)
adminRoute.get('/admin', (req, res) => {
  res.status(200).render('index', {page: 'admin', title: 'Admin Dashboard'})
})

adminRoute.use('/admin', certaddRoute)
adminRoute.use('/admin', updatecertRoute)
adminRoute.use('/admin', addcourseRoute)
adminRoute.use('/admin', editcourseRoute)
adminRoute.use('/admin', deletecertRoute)
adminRoute.use('/admin', deletecourseRoute)

export { adminRoute, isAdmin}