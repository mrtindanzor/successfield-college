import express from "express"
import router from "./assets/routes/routes.js"
import icons from "./assets/public/scripts/icons.js";
import session from "express-session";
import passport from "passport";
import path from "path"
import MongoStore from "connect-mongo"
import { sendMailAsync } from "./assets/routes/all/sendmail.js";
import mailTemplates from "./assets/routes/all/mailtemplates.js";
import { env, courseModel, errhandler, page404 } from './dependencies.js'


const baseurl = env.PROD_ENV === 'PROD' ? env.LIVE_BASE_URL : env.DEV_BASE_URL,
  uri = env.DATABASE,
  app = express(),
  PORT = env.PORT || 8000,
  time = 600000,
  isSession = (req, res, next) => {
    if(req.session) {
      req.session._garbage = Date.now()
      req.session.touch()
    }
    next()
  },
  pingService = () => {
    console.log(baseurl)
    fetch(baseurl).then(() => console.log(`pinging ${baseurl}`))
  }
  pingService()
  setInterval(pingService, time);

app.use(session({
  store: MongoStore.create({
    mongoUrl: uri,
    collectionName: 'session'
  }),
  secret: env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge:  60 * 60 * 1000
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(async (req, res, next) => {
  if(req.isAuthenticated()) req.isLoggedIn = true
  if(req.isAuthenticated() && req.user.admin) req.isAdmin = true
  const courses = await courseModel.find({}),
    isLoggedIn = req.isLoggedIn
    res.locals.isAdmin = req.isAdmin
    res.locals.courses = courses
    res.locals.isLoggedIn = isLoggedIn
    res.locals.icons = icons
  next()
})
app.use(isSession)
app.use(express.json())
app.set('views', path.resolve('./assets/views'))
app.set('view engine', 'ejs')
app.use(express.static('./assets/public'))
app.use(router)

app.get('/contact', (req, res) => res.render('index', {page: 'contact'}))
app.get('/about', (req, res) => res.render('index', {page: 'about'}))
app.get('/test', (req, res) => {})

app.use(page404)
app.use(errhandler)

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

if(env.PROD_ENV === 'PROD'){
  const subject =  `App deployed successfully`,
          html = (new mailTemplates).deployed()
          sendMailAsync(subject, html, env.DEVELOPER_MAIL)
}


export default app
