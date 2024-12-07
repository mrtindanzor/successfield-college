import { Router } from "express";
import { certaddRoute } from "./certadd.js";
import updatecertRoute from "./updatecert.js";
import addcourseRoute from "./addcourse.js";
import editcourseRoute from "./editcourse.js";

const adminRoute = Router(),
checkAdmin = (req, res, next) => {
  if(!req.isAdmin) return res.status(403).redirect('/')
  res.locals.isAdmin = true
  next()
}


adminRoute.get('/admin', checkAdmin, (req, res) => {
  res.status(200).render('index', {page: 'admin', title: 'Admin Dashboard'})
})

adminRoute.use('/admin', checkAdmin, certaddRoute)
adminRoute.use('/admin', checkAdmin, updatecertRoute)
adminRoute.use('/admin', checkAdmin, addcourseRoute)
adminRoute.use('/admin', checkAdmin, editcourseRoute)

export default adminRoute