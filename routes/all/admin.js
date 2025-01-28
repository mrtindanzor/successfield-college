import { Router } from "express";
import { courseRoute } from './course.js'
import certRoute from "./cert.js";
import { partnerRoute } from "./partner.js";
import { userModel, partnerModel, isAdmin, certificateModel } from "../../dependencies.js";
import moduleRoute from "./modules.js";
import registerStudent from "./register-student.js";

const adminRoute = Router()

adminRoute.use('/admin', isAdmin)
adminRoute.get('/admin', async (req, res) => {
  let students = await userModel.find({})
  students = students.filter(student => !student.admin)
  const partners = await partnerModel.find({})
  const certificates = await certificateModel.find({})
  res.status(200).render('index', {page: 'admin', title: 'Admin Dashboard', students, partners, certificates })
})
adminRoute.use('/admin', courseRoute)
adminRoute.use('/admin', certRoute)
adminRoute.use('/admin', partnerRoute)
adminRoute.use('/admin', moduleRoute)
adminRoute.use('/admin', registerStudent)

export { adminRoute, isAdmin}