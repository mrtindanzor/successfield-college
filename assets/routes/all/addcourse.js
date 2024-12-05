import { Router } from "express"
import { courseModel } from "../../../app.js"

const addcourseRoute = Router(),
checkAdmin = (req, res, next) => {
  if(!req.isAdmin) return res.status(403).redirect('/unknown')
  next()
}

addcourseRoute.get('/addcourse', checkAdmin, (req, res) => {
  res.status(200).render('index', {page: 'addcourse', title: 'Add new course'})
} )

addcourseRoute.post('/addcourse', checkAdmin, async (req, res) => {
  const newCourse = req.body
  if(!newCourse) return res.status(400).json({status: 400, msg: 'No course was sent'})
  const course = new courseModel(newCourse)

  console.log(course)
  
  // course.save().then(() => {
  //   if(course.isNew) return res.status(400).json({status: 400, msg: 'An error occured while trying to save course'})
  //   return res.status(201).json({status: 201, msg: 'Course created successfully'})
  // })
})

export default addcourseRoute