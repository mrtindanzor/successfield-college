import { Router } from "express";
import { courseRoute } from './course.js'
import certRoute from "./cert.js";
import { partnerRoute } from "./partner.js";
import { userModel, isAdmin } from "../../../dependencies.js";
import { sendMailAsync } from "./sendmail.js";
import mailTemplates from "./mailtemplates.js";

const adminRoute = Router()

adminRoute.use('/admin', isAdmin)
adminRoute.get('/admin', (req, res) => {
  res.status(200).render('index', {page: 'admin', title: 'Admin Dashboard'})
})
adminRoute.put('/makeadmin', async (req, res) => {
  const { email, makeadmin } = req.body

  if(!email || (makeadmin !== false && makeadmin !== true)) return res.status(400).json({status: 400, msg: 'Fill in all details'})
  if(typeof makeadmin !== 'boolean') return res.status(400).json({status: 400, msg: 'must only be a boolean'})
  const findUser = await userModel.findOne({email})
  if(!findUser) return res.status(404).json({status: 404, msg: 'no user found'})

  const setAdmin = await userModel.findOneAndUpdate({email}, {$set: {admin : makeadmin}})
  if(!setAdmin) return res.status(500).json({status: 500, msg: `failed to change admin status to ${makeadmin}`})
    const name = findUser.firstname + ' ' + findUser.surname,
          subject =  `Admin status changed`,
          html = (new mailTemplates).setAdminStatus(name, email, makeadmin)
          await sendMailAsync(subject, html)
          const users = await userModel.find({admin: true}).catch(err => console.log(err))
          if(users){
            users.forEach(el => {
              sendMailAsync(subject, html, el.email)
            })
          }
  return res.status(201).json({status: 201, msg: `admin status is now set to ${makeadmin}`})
})
adminRoute.use('/admin', courseRoute)
adminRoute.use('/admin', certRoute)
adminRoute.use('/admin', partnerRoute)

export { adminRoute, isAdmin}