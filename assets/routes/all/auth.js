import express from 'express'
import { Router } from "express"
import passport from 'passport'
import bcrypt from 'bcrypt'
import { Strategy as localStrategy } from 'passport-local'
import { userModel } from '../../../app.js'
import sendMailAsync  from './sendmail.js'
import mailTemplates from './mailtemplates.js'
import { baseurl } from '../../../app.js'

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
  email = email.trim()
  let date = Date.now()
  const user = await userModel.findOne({email})
  if(!user) return done(null, false, {msg: "Invalid credentials"})
    let verificationStatus = user.verified
  if(!verificationStatus) {
    const setVerificationCode = await userModel.findOneAndUpdate({email}, {$set: {verificationCode: date}})
    if(!setVerificationCode) return done(null, false, {msg: 'An error occured while sending verification email'})

    const to = email,
      subject =  `Verify email address`,
      link = `${baseurl}/users/verify/${date}`,
      html = (new mailTemplates).verifyAccoutTemplate(link)
    const sendMail = await sendMailAsync(to, subject, html)
    if(sendMail.accepted.length < 1) return done(null, false, {msg: 'An error occured, try again'})
    if(sendMail.accepted.length === 1) return done(null, false, {msg: 'Email sent to your address, please verify'})
    
  }
  
  const isPasswordMatch = await bcrypt.compare(password.trim(), user.password)
  if(!isPasswordMatch) return done(null, false, {msg: 'Incorrect password'})
  return done(null, user)
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

        email = email.trim()
        password = password.trim()
        cpassword = cpassword.trim()
        firstname = firstname.trim()
        surname = surname.trim()
        
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
  
  const emailExists = await userModel.findOne({email})
  if(emailExists){
    error = 1
    emailExistsErr = 'User with this email already exists!'
}
  
  if(error == 1) {
    return res.render('index', {page: 'join', fnerr, snerr, emailerr, passerr, cpasserr, emailExistsErr})
  } 
  
  const  hashedPassword = await bcrypt.hash(password, 10),
  details = {
    email: email, 
    password: hashedPassword, 
    firstname: firstname, 
    surname: surname, 
    date, 
    verificationCode: date,
    verified: false
  },
  newUser = new userModel(details)
  newUser.save()
    .then( async() => {
      if(!newUser.isNew) {
        const to = email,
          subject =  `Verify email address`,
          link = `${baseurl}/users/verify/${date}`,
          html = (new mailTemplates).verifyAccoutTemplate(link),
          sendMail = await sendMailAsync(to, subject, html)
          if(sendMail.accepted.length < 1) {
            userModel.findOneAndDelete({email})
            return res.status(400).json({status: 400, msg: 'An error occured, try again'})
          }
          if(sendMail.accepted.length === 1) return res.status(201).json({status: 201, msg: 'Account created, an email was sent to your address, click link to verify'})
      }
    })
    
})
authroute.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if(err) return next(err)
    
    let passerr = '',
        failure = ''

    if(info) failure = info.msg

    if(!user){ 
      return res.render('index', {page:'login', failure, passerr})
    }
    req.logIn(user, err => {
      if(err) next(err)
      return res.redirect('/')
    })
  })(req, res, next)
})
authroute.get('/verify/:date', async (req, res) => {
  const verificationCode = req.params.date
    const findUser = await userModel.findOne({verificationCode})
    if(!findUser) return res.status(404).send({status: 404, msg: 'An error occured'})
    
    const updateVerificationStatus = await userModel.findOneAndUpdate({verificationCode}, {$set: {verified: true}})
    if(!updateVerificationStatus) return res.status(400).json({status: 400, msg: 'Error verifying your account'})
    return res.status(200).json({status: 200, msg: 'Account verified successfully'})
})
authroute.get('/logout', (req, res) => {
  req.logOut(err => {
    if(err) return next(err)
    res.redirect('/')
  })
})
export default authroute