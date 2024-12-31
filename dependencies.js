import { config } from "dotenv";
import mongoose from "mongoose";
import path from 'path'
import mailTemplates from "./assets/routes/all/mailtemplates.js";
import { sendMailAsync } from "./assets/routes/all/sendmail.js";
import icons from "./assets/public/scripts/icons.js";

const env = config().parsed,
  baseurl = env.PROD_ENV === 'PROD' ? env.LIVE_BASE_URL : env.DEV_BASE_URL, 
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
    middlename: String,
    surname: String,
    password: String,
    email: String,
    phone: Number,
    date: String,
    verificationCode: String,
    verified: Boolean,
    namechanged: Boolean,
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
  partnerSchema = new schema({
    name: String,
    location: String,
    approvals: [{approval: String}],
    partnerId: String
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
  partnerModel = mongoose.model('partner', partnerSchema),
  pingService = () => {
    fetch(baseurl).then(() => console.log(`pinging ${baseurl}`))
  },
  isSession = (req, res, next) => {
    if(req.session) {
      req.session._garbage = Date.now()
      req.session.touch()
    }
    next()
  },
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
  },
  alpahanumericPattern = /^[A-Za-z0-9 .]+$/,
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  numberPattern = /^[0-9]+$/,
  authenticated = (req, res, next) => {
    if(req.isAuthenticated() && req.query.switch !== 'true') return res.redirect('/')
    next()
  },
  isNotAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()) return res.redirect('/')
    next()
  },
  isAdmin = (req, res, next) => {
    if(!req.isAdmin) return res.status(403).redirect('/')
    next()
  }
  async function appStarted() {
    const subject =  `App deployed successfully`,
          html = (new mailTemplates).deployed()
          sendMailAsync(subject, html, env.DEVELOPER_MAIL)
  }
  async function setVariables (req, res, next) {
    res.locals.isLoggedIn = false
    if(req.isAuthenticated()) {
      res.locals.isLoggedIn = true
      res.locals.user = req.user || null
    }
    if(req.isAuthenticated() && req.user.admin) req.isAdmin = true
    const courses = await courseModel.find({})
    res.locals.courses = courses
    res.locals.isAdmin = req.isAdmin
    res.locals.icons = icons
    next()
  }
  async function isPartner(req, res, next){
    res.locals.partner = false
    const partner = await partnerModel.findOne({}).catch(err => console.log(err))
    if(partner) res.locals.partner = true
    next()
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
  courseModel, imageModel, partnerModel,
  uploadPath, errhandler, page404, appStarted,
  setVariables, pingService, isSession,
  isAdmin, authenticated, isNotAuthenticated,
  isPartner, emailPattern, alpahanumericPattern, numberPattern
}