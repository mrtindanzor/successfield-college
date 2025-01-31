import { Router } from 'express'
import { courseModel, userModel } from '../../dependencies.js'
import mailTemplates from './mailtemplates.js'
import { sendMailAsync } from './sendmail.js'

const registerStudent = Router()

registerStudent.get('/register/:route', async function(req, res){
  const route = req.params.route.toLocaleLowerCase().trim()

  if(route === 'add') return res.render('index', {page: 'register-student', title: 'Register student for course', section: 'add'})
  if(route === 'delete') return res.render('index', {page: 'register-student', title: 'Remove student from course', section: 'delete'})
})

registerStudent.put('/register', async function(req, res){
  const course = req.body.course.trim().toLocaleLowerCase()
  const studentNumber = req.body.studentNumber.trim()

  if(!course || !studentNumber) return res.json({status: 403, msg: 'Invalid details'})
  
  const getUser = await userModel.findOne({studentNumber})
  if(!getUser) return res.json({status: '404', msg: 'Studen not found'})
  
  const checkCourse = getUser.courses.find(el => el.course.toLowerCase().trim() === course)
  if(checkCourse) return res.json({status: 304, msg: 'Student is already register to course'})
  
  const add = await userModel.findOneAndUpdate({studentNumber}, {$push: {courses: {course}}})
  if(!add) return res.json({status: 500, msg: 'Error registering course'})
  const subject = 'Course Registration Successful'
  const name = getUser.firstname + " " + (getUser.firstname ?? '') + ' ' + getUser.surname
  const email = getUser.email
  const html = (new mailTemplates()).courseRegistered(name, course)
  const sendmail = await sendMailAsync(subject, html, email)
  return res.json({status: 201, msg: 'Register course successfully'})
})

registerStudent.delete('/register', async function(req, res){
  const course = req.body.course.trim().toLocaleLowerCase()
  const studentNumber = req.body.studentNumber.trim()

  if(!course || !studentNumber) return res.json({status: 403, msg: 'Invalid details'})
  
  const getUser = await userModel.findOne({studentNumber})
  if(!getUser) return res.json({status: '404', msg: 'Student not found'})
  
  const checkCourse = getUser.courses.find(el => el.course.toLowerCase().trim() === course)
  if(!checkCourse) return res.json({status: 304, msg: 'Student is not registered to course'})
  
  const add = await userModel.findOneAndUpdate({studentNumber}, {$pull: {courses: {course}}})
  if(!add) return res.json({status: 500, msg: 'Error deregistering course'})
  return res.json({status: 201, msg: 'Deregistered course successfully'})
})

export default registerStudent