import { Router } from "express"
import { courseModel } from "../../../dependencies.js"

const courseRoute = Router(), 
  showCourseRoute = Router()

showCourseRoute.get('/courses/:course', async (req, res) => {
  const course = req.params.course.toLowerCase().trim(),
  findCourse = await courseModel.findOne({course})
  if(!findCourse) return res.render('index', {page: 404})
  res.status(200).render("index", {page: "course", section: 'show', title: course.toUpperCase(), findCourse})
})

showCourseRoute.get('/courses/:course/:module', async (req, res) => {
  let { course, module} = req.params
  course = course.trim().toLocaleLowerCase()
  const findCourse = await courseModel.findOne({course})
  if(!findCourse) return res.render('index', {page: 404})
  res.status(200).render("index", {page: "module", section: 'show', title: 'module', findCourse})
})

courseRoute.get('/course/:param', (req, res) => {
  const param = req.params.param
  if(param === 'add') return res.status(200).render('index', {page: 'course', section: 'add', title: 'Add new course'})
  if(param === 'edit') return res.status(200).render('index', {page: 'course', section: 'edit', title: 'Edit Course'})
  if(param === 'delete') return res.status(200).render('index', {page: 'course', section: 'delete', title: 'Delete Course'})
} )

courseRoute.post('/course', async (req, res) => {
  const course = req.body.course.toLowerCase().trim()
  if(!course) return res.status(400).json({status: 400, msg: 'No course was sent'})
  const isCourse = await courseModel.findOne({course})
  if(!isCourse) return res.status(404).json({status: 404, msg: 'No course found'})
  return res.status(200).json({status: 200, ...isCourse._doc})
})

courseRoute.put('/course', async (req, res) => {
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

courseRoute.patch('/course', async (req, res) => {
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


courseRoute.delete('/course', async (req, res) => {
  const course = req.body.course.toLowerCase().trim()
  if(!course) return res.status(400).json({status: 400, msg: 'Enter a valid course name'})

  const delCourse = await courseModel.findOneAndDelete({course})
  if(!delCourse) return res.status(500).json({status: 500, msg: 'An error occured while trying to delete course'})
  return res.status(200).json({status: 200, msg: "Course deleted"})
})



export { courseRoute, showCourseRoute }