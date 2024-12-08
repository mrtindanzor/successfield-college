import { Router } from "express";
import { courseModel } from "../../../app.js"

const deletecourseRoute = Router()

deletecourseRoute.get('/deletecourse', (req, res) => {
  return res.status(200).render('index', {page: 'deletecourse', title: 'Delete Course'})
})

deletecourseRoute.post('/deletecourse', async (req, res) => {
  const course = req.body.course.toLowerCase().trim()
  if(!course) return res.status(400).json({status: 400, msg: 'Enter a valid course name'})

  const delCourse = await courseModel.findOneAndDelete({course})
  if(!delCourse) return res.status(500).json({status: 500, msg: 'An error occured while trying to delete course'})
  return res.status(200).json({status: 200, msg: "Course deleted"})
})

export default deletecourseRoute