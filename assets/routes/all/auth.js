import express from 'express'
import { Router } from "express"
import passport from 'passport'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import { Strategy as localStrategy } from 'passport-local'
import { userModel } from '../../../app.js'

config()// dot env vairable function
const authroute = Router(),
alpahanumericPattern = /^[A-Za-z0-9 .]+$/,
emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

let error = 0,
    emailerr = '',
    fnerr = '',
    snerr = '', 
    passerr = '',
    cpasserr = '',
    emailExistsErr = ''

authroute.use(express.urlencoded({extended: false}))

passport.use(new localStrategy({usernameField: "email"}, async (email, password, done) => {
try{

  const user = await userModel.findOne({email})
  if(!user) return done(null, false, {msg: "Invalid credentials"})
  
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if(!isPasswordMatch) return done(null, false, {msg: 'Incorrect password'})
  return done(null, user)
} catch(err){
  return done(err)
}
}))

passport.serializeUser((user, done) => {
  return done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findOne({_id: id})
  if(!user) return done(null, false)
  return done(null, user)
})

authroute.get('/',(req, res) => {
  res.redirect('/')
})
authroute.get('/join',(req, res) => {
  res.render('index', {page: 'join'})
})
authroute.get('/login',(req, res) => {
  res.render('index', {page: 'login'})
})
authroute.post('/join', async (req, res) => {
  let { body: {email, password, cpassword, firstname, surname} } = req,
        date = Date.now()

  if(!email || !email.match(emailPattern)){
    error = 1
    emailerr = 'Invalid email format!'
  }

  if(cpassword !== password){
    error = 1
    cpasserr = 'Passwords do not match!'
  }
  
  if(!firstname || !firstname.match(alpahanumericPattern)){
    error = 1
    fnerr = 'Firstname must only contain alphanumeric characters!'
  }

  if(!surname || !surname.match(alpahanumericPattern)){
    error = 1
    snerr = 'Surname must only contain alphanumeric characters!'
  }
  
  const emailExists = userModel.findOne({email}, (err, email) => {
    if(err) return
    return email
  })
  if(emailExists){
    error = 1
    emailExistsErr = 'User with this email already exists!'
}
  
  if(error == 1) {
    return res.render('index', {page: 'join', fnerr, snerr, emailerr, passerr, cpasserr, emailExistsErr})
  } 
  
  const  hashedPassword = await bcrypt.hash(password, 10),
  details = {email,password: hashedPassword,firstname,surname,date},
  newUser = new userModel(details)
  newUser.save()
    .then(() => {
      if(!newUser.isNew) {
        req.body = ''
        res.render('index', {page: 'login', successReg: 'Registered successfully login'})
      }
    })
    
})
authroute.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if(err) return next(err)
    
    let passerr = '',
        failure = ''

    if(info){
      if(info.message == 'Invalid email format') failure = info.message
      if(info.message == 'Invalid credentials') failure = info.message
      if(info.message == 'Incorrect password') passerr = info.message
    }

    if(!user){ 
      return res.render('index', {page:'login', failure, passerr})
    }
    req.logIn(user, err => {
      if(err) next(err)
      return res.redirect('/')
    })
  })(req, res, next)
})
authroute.get('/logout', (req, res) => {
  req.logOut(err => {
    if(err) return next(err)
    res.redirect('/')
  })
})
export default authroute