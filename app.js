import express from "express"
import router from "./assets/routes/routes.js"
import cors from 'cors'
import session from "express-session";
import passport from "passport";
import path from "path"
import MongoStore from "connect-mongo"
import { env, courseModel, errhandler, page404, appStarted, setVariables, pingService, isSession, isPartner } from './dependencies.js'


const uri = env.DATABASE,
  app = express(),
  PORT = env.PORT || 8000,
  time = 600000

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
app.use(cors())
app.use(setVariables)
app.use(isSession)
app.use(isPartner)
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
  appStarted()
}


export default app
