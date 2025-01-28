import { Router } from "express";
import { courseRoute } from './course.js'
import certRoute from "./cert.js";
import { partnerRoute } from "./partner.js";
import { userModel, isAdmin } from "../../dependencies.js";
import moduleRoute from "./modules.js";
import registerStudent from "./register-student.js";

const adminRoute = Router()

adminRoute.use('/admin', isAdmin)
adminRoute.get('/admin', (req, res) => {
  res.status(200).render('index', {page: 'admin', title: 'Admin Dashboard'})
})
adminRoute.use('/admin', courseRoute)
adminRoute.use('/admin', certRoute)
adminRoute.use('/admin', partnerRoute)
adminRoute.use('/admin', moduleRoute)
adminRoute.use('/admin', registerStudent)

export { adminRoute, isAdmin}