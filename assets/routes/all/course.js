import { Router } from "express"
import { courseModel } from "../../../app.js"

const courseRoute = Router()

courseRoute.get('/course/:course', async (req, res) => {
  const course = req.params.course.toLowerCase().trim(),
  findCourse = await courseModel.findOne({course})
  if(!findCourse) return res.render('index', {page: 404})
  res.status(200).render("index", {page: "course", title: course.toUpperCase(), findCourse})
})

export default courseRoute