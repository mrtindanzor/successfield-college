import { config } from "dotenv";
import mongoose from "mongoose";
import path from 'path'
import mailTemplates from "./assets/routes/all/mailtemplates.js";
import { sendMailAsync } from "./assets/routes/all/sendmail.js";

const env = config().parsed,
  uri = env.DATABASE,
  schema = mongoose.Schema,
  certificateSchema = new schema({
    name: String,
    studentNumber: String,
    certificateCode: String,
    programme: String,
    dateCompleted: String
  }),
  userSchema = new schema({
    firstname: String,
    surname: String,
    password: String,
    email: String,
    date: String,
    verificationCode: String,
    verified: Boolean,
    admin: Boolean
  }),
  courseSchema = new schema({
    course: String,
    overview: String,
    outlines: [{ outline: String}],
    objectives: [{ objective: String }],
    benefits: [{ benefit: String }],
    duration: String,
    availability: String,
    certificate: String,
    fee: String
  }),
  imageUploadSchema = new schema({
    name: String,
    path: String
  }),
  uploadPath = path.resolve('./assets/uploads'),
  certificateModel = mongoose.model('certificate', certificateSchema),
  userModel = mongoose.model('user', userSchema),
  courseModel = mongoose.model('course', courseSchema),
  imageModel = mongoose.model('image', imageUploadSchema),
  page404 = (req, res) => res.status(404).render('index', {page: 404, title: 'Page not found'}),
  errhandler = async (err, req, res, next) => {
    console.log(err)
    const status = err.status || 500,
      message = err.message || 'An error occured so the app has failed',
      subject = 'Successfield app failed',
      to = env.DEVELOPER_MAIL,
      html = (new mailTemplates).serverError(status, message)
      sendMailAsync(subject, html, to)
      next(err)
  }


  try{
    mongoose.Promise = global.Promise
    mongoose.connect(uri)
    mongoose.connection.once('open', () => console.log('connected to database successfully')).on('error', (error) => {
      console.log('An error occured while connecting to database', error)
    })
  } catch(err) {
    console.log('a new error', err)
  }

export { env, certificateModel, userModel, 
  courseModel, imageModel, uploadPath, 
  errhandler, page404
}