import express from "express"
import router from "./assets/routes/routes.js"
import authroute from "./assets/routes/all/auth.js";
import icons from "./assets/public/scripts/icons.js";
import session from "express-session";
import passport from "passport";
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv";

dotenv.config()//dot env function
const app = express(),
      filename = fileURLToPath(import.meta.url),
      dirname = path.dirname(filename),
      time = 60 * 14 * 1000,
      PORT = process.env.PORT || 8000,
      isAuthenticated = (req, res, next) => {
        if(req.isAuthenticated()) req.isLoggedIn = true
        next()
      }

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(isAuthenticated)
app.use((req, res, next) => {

  const isLoggedIn = req.isLoggedIn || false
  res.locals.isLoggedIn = isLoggedIn
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

export default app
