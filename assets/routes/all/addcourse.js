import { Router } from "express"
import { courseModel } from "../../../app.js"

const addcourseRoute = Router()

addcourseRoute.get('/addcourse', (req, res) => {
  res.status(200).render('index', {page: 'addcourse', title: 'Add new course'})
} )

addcourseRoute.put('/addcourse', async (req, res) => {
  const newCourse = req.body
  if(!newCourse) return res.status(400).json({status: 400, msg: 'No course was sent'})
  const isCourse = await courseModel.findOne({course: newCourse.course})
  if(isCourse) return res.status(400).json({status: 400, msg: 'Course already in database'})

  const course = new courseModel(newCourse)
  course.save().then(() => {
    if(course.isNew) return res.status(400).json({status: 400, msg: 'An error occured while trying to save course'})
    return res.status(201).json({status: 201, msg: 'Course created successfully'})
  })
})

export default addcourseRoute