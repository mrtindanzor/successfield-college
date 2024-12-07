import { Router } from "express"
import { courseModel } from "../../../app.js"

const editcourseRoute = Router(),
checkAdmin = (req, res, next) => {
  if(!req.isAdmin) return res.status(403).redirect('/')
  next()
}

editcourseRoute.get('/editcourse', checkAdmin, (req, res) => {
  res.status(200).render('index', {page: 'editcourse', title: 'edit new course'})
} )

editcourseRoute.post('/findcourse', checkAdmin, async (req, res) => {
  const course = req.body
  if(!course) return res.status(400).json({status: 400, msg: 'No course was sent'})
  const isCourse = await courseModel.findOne(course)
  if(!isCourse) return res.status(404).json({status: 404, msg: 'No course found'})
  return res.status(200).json({status: 200, isCourse})
})

editcourseRoute.post('/editcourse', checkAdmin, async (req, res) => {
  const newCourse = req.body,
    courseName = newCourse.course
  if(!newCourse) return res.status(400).json({status: 400, msg: 'No course was sent'})
  const isCourse = await courseModel.findOne({course: courseName})
  if(!isCourse) return res.status(404).json({status: 404, msg: 'No course found'})
  if(isCourse._id.toString() !== newCourse.id) return res.status(404).json({status: 404, msg: 'Course id not matching'})

  courseModel.findOneAndUpdate({course: courseName}, newCourse, { new: true })
    .then((result) => {
      if(!result) return res.status(400).json({status: 400, msg: 'An error occured while trying to edit course'})
        return res.status(201).json({status: 201, msg: 'Course edited successfully'})
    })
    .catch((err) => {
      return res.status(500).json({status: 500, msg: err.msg})
    })
})

export default editcourseRoute