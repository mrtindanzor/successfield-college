import { Router } from 'express'
import { courseModel } from '../../dependencies.js'

const purchaseCourseRoute = Router()

purchaseCourseRoute.get('/purchase/:course', async function(req, res){
  const course = req.params.course.toLowerCase().trim()
  const findCourse = await courseModel.findOne({course})
  if(!req.isAuthenticated()) {
    res.render('index', {page: 'login', title: 'Members Area', referer: req.originalUrl})
    return
  }
  const user = req.user
  const hasCourse = user.courses?.find(el => el.course === course)
  if(hasCourse || user.admin){
    const module = hasCourse?.currentModule || 1
    return res.redirect(`/courses/${course}/${module}`)
  }
  return res.render('index', {page: 'purchase', title: `Purchase ${course}`, findCourse})
})

export {
  purchaseCourseRoute
}