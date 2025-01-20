import { Router } from 'express'
import { courseModel } from '../../dependencies.js'

const moduleRoute = Router()

moduleRoute.get('/module/:route', async function(req, res){
  const route = req.params.route.toLowerCase().trim()
  if(route === 'add') return res.render('index', {page: 'module', title: 'Add a module', section: 'add' })
  if(route === 'edit') return res.render('index', {page: 'module', title: 'Update a module', section: 'edit' })
  if(route === 'delete') return res.render('index', {page: 'module', title: 'Delete a module', section: 'delete' })
})

moduleRoute.put('/module', async function(req, res){
  const { course, index, title, link } = req.body
  const module = req.body

  if(!course || !index || !title || !link) return res.json({status: 403, msg: 'Add all fields'})
  delete module.course
  const checkModule = await courseModel.findOne({course})
  const modules = checkModule.modules
  for(const el of modules){
    if(el.title.trim() === module.title.trim()) return res.json({status: 400, msg: 'Module already exists'})
  }
  const add = await courseModel.findOneAndUpdate({course}, { $push: { modules: module} }, {new: true} )
  if(!add) return res.json({status: 400, msg: 'Error adding module'})
  return res.json({status: 201, msg: 'Module added successfully'})
  
})

moduleRoute.delete('/module', async function(req, res){
  const { course, index} = req.body

  if(!course || !index ) return res.json({status: 403, msg: 'Add all fields'})

  const deleted = await courseModel.findOneAndUpdate({course}, { $pull: { modules: { index }  } }, {new: true} )
  if(!deleted) return res.json({status: 400, msg: 'Error deleting module'})
  return res.json({status: 201, msg: 'Module deleted successfully'})
})

// moduleRoute.put('/module', async function(req, res){
//   const { course, index, title, link } = req.body
//   const module = req.body

//   if(!course || !index || !title || !link) return res.json({status: 403, msg: 'Add all fields'})
//   delete module.course
//   const checkModule = await courseModel.findOne({course})
//   const modules = checkModule.modules
//   for(const el of modules){
//     if(el.title.trim() === module.title.trim()) return res.json({status: 400, msg: 'Module already exists'})
//   }
//   const add = await courseModel.findOneAndUpdate({course}, { $push: { modules: module} }, {new: true} )
//   if(!add) return res.json({status: 400, msg: 'Error adding module'})
//   return res.json({status: 201, msg: 'Module added successfully'})
  
// })

export default moduleRoute