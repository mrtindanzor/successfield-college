import { Router } from "express"
import { courseModel } from "../../../dependencies.js"

const editcourseRoute = Router()

editcourseRoute.get('/editcourse', (req, res) => {
  res.status(200).render('index', {page: 'editcourse', title: 'Edit a course'})
} )

editcourseRoute.post('/findcourse', async (req, res) => {
  const course = req.body.course.toLowerCase().trim()
  if(!course) return res.status(400).json({status: 400, msg: 'No course was sent'})
  const isCourse = await courseModel.findOne({course})
  if(!isCourse) return res.status(404).json({status: 404, msg: 'No course found'})
  return res.status(200).json({status: 200, isCourse})
})

editcourseRoute.put('/editcourse', async (req, res) => {
  const newCourse = req.body,
    courseName = newCourse.course,
    id = newCourse.id
  if(!newCourse) return res.status(400).json({status: 400, msg: 'No course was sent'})
  const isCourse = await courseModel.findOne({_id: id})
  if(!isCourse) return res.status(404).json({status: 404, msg: 'No course found'})
  if(isCourse._id.toString() !== newCourse.id) return res.status(404).json({status: 404, msg: 'Course id not matching'})

  courseModel.findOneAndUpdate({_id: id}, newCourse, { new: true })
    .then((result) => {
      if(!result) return res.status(400).json({status: 400, msg: 'An error occured while trying to edit course'})
        return res.status(201).json({status: 201, msg: 'Course edited successfully'})
    })
    .catch((err) => {
      return res.status(500).json({status: 500, msg: err.msg})
    })
})

export default editcourseRoute