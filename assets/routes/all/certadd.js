import { Router } from "express"
import Loki from "lokijs"

let certificateCollection
const certaddRoute = Router(), 
loadHandler = () => { 
  certificateCollection = database.getCollection('certificates') || database.addCollection('certificates')
  database.saveDatabase()
},
  database = new Loki('./config/certificates.json', {autoload: true, autoloadCallback: loadHandler , persistenceMethod: "fs"})


certaddRoute.post('/certadd', async (req, res) => {
  const certificate = req.body
  console.log(certificate)
  certificateCollection.insert(certificate)
  database.saveDatabase()
  return res.status(201).json({msg: 'added successfully'})

})

certaddRoute.get('/certadd', (req, res) => {
  res.status(200).render('index', {page: 'certadd', title: 'Add certificate'})
})

export default certaddRoute