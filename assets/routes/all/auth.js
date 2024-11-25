import express from 'express'
import { Router } from "express"
import passport from 'passport'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import { Strategy as localStrategy } from 'passport-local'

config()// dot env vairable function
const authroute = Router(),
usersDb = [],
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
  const findUser = usersDb.find(user => user.email === email)
    if(!findUser) return done(null, false, {message: "Invalid credentials"})
    
    try{
      const isPasswordMatch = await bcrypt.compare(password, findUser.password)
    if(!isPasswordMatch) return done(null, false, {message: "Incorrect password"})
    
    return done(null, findUser)
    } catch(passwordCompareError){
      return done(null, false, {message: 'An error occured while comparing passwords'})
    }
}))

passport.serializeUser((user, done) => {
  return done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  const findUser = usersDb.find( user => user._id === id)
  if(!findUser) return done(null, false, {message: 'Invalid credentials'})
  return done(null, findUser)
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
        date = Date.now(),
        _id = date

        console.log(usersDb)
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
  
  const emailExists = usersDb.find(user => user.email === email)
  if(emailExists){
    error = 1
    emailExistsErr = 'User with this email already exists!'
}
  
  if(error == 1) {
    return res.render('index', {page: 'join', fnerr, snerr, emailerr, passerr, cpasserr, emailExistsErr})
  } 
  
  const  hashedPassword = await bcrypt.hash(password, 10)
    usersDb.push({email,password: hashedPassword,firstname,surname,date,_id})
    req.body = ''
    res.render('index', {page: 'login', successReg: 'Registered successfully login'})
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