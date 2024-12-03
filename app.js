import express from "express"
import router from "./assets/routes/routes.js"
import authroute from "./assets/routes/all/auth.js";
import icons from "./assets/public/scripts/icons.js";
import session from "express-session";
import passport from "passport";
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config()//dot env function


const uri = process.env.DATABASE,
checkAdmin = (req, res, next) => {
  if(!isAdmin) return res.status(403).redirect('/')
  next()
},
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
    date: String
  }),
  certificateModel = mongoose.model('certificate', certificateSchema),
  userModel = mongoose.model('user', userSchema),
  app = express(),
  filename = fileURLToPath(import.meta.url),
  dirname = path.dirname(filename),
  PORT = process.env.PORT || 8000,
  time = 600000,
  isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) req.isLoggedIn = true
    next()
  },
  isAuthenticatedAsAdmin = (req, res, next) => {
    if(req.isAuthenticated() && ((req.user.firstname.trim().toLowerCase() === process.env.ADMIN_SECRET.toLowerCase()) || (req.user.firstname.trim().toLowerCase() === process.env.DEVELOPER_SECRET.toLowerCase()))) req.isAdmin = true
    next()
  },
  pingService = () => {
    fetch('https://www.gism.online').then(() => console.log('pinging site'))
  }

  setInterval(pingService, time);

try{
  mongoose.Promise = global.Promise
  mongoose.connect(uri)
  mongoose.connection.once('open', () => console.log('connected to database successfully')).on('error', (error) => {
    console.log('An error occured while connecting to database', error)
  })
} catch(err) {
  console.log('a new error', err)
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(isAuthenticated)
app.use(isAuthenticatedAsAdmin)
app.use((req, res, next) => {

  const isLoggedIn = req.isLoggedIn || false,
   isAdmin = req.isAdmin
  res.locals.isLoggedIn = isLoggedIn
  res.locals.isAdmin = isAdmin
  res.locals.icons = icons
  next()
})
const page404 = (req, res) => res.status(404).render('index', {page: 404, title: 'Page not found'})
app.use(express.json())
app.set('views', path.join(dirname, './assets/views'))
app.set('view engine', 'ejs')
app.use(express.static('./assets/public'))
router.use('/users', authroute)
app.use(router)

app.get('/contact', (req, res) => res.render('index', {page: 'contact'}))
app.get('/about', (req, res) => res.render('index', {page: 'about'}))
app.get('/test', (req, res) => {
  
})

app.use(page404)

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

export { app, certificateModel, userModel, checkAdmin }
