import express from 'express'
import { Router } from "express"
import passport from 'passport'
import bcrypt from 'bcrypt'
import { Strategy as localStrategy } from 'passport-local'
import { userModel } from '../../../app.js'
import { sendMailAsync }  from './sendmail.js'
import mailTemplates from './mailtemplates.js'
import { baseurl } from '../../../app.js'

const authroute = Router(),
  alpahanumericPattern = /^[A-Za-z0-9 .]+$/,
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  authenticated = (req, res, next) => {
    if(req.isAuthenticated()) return res.redirect('/')
    next()
  }

authroute.use(express.urlencoded({extended: false}))
passport.use(new localStrategy({usernameField: "email"}, async (email, password, done) => {
  email = email.trim()
  let date = Date.now()
  const user = await userModel.findOne({email})
  if(!user) return done(null, false, {status: 404})
    let verificationStatus = user.verified
  if(!verificationStatus) {
    const setVerificationCode = await userModel.findOneAndUpdate({email}, {$set: {verificationCode: date}})
    if(!setVerificationCode) return done(null, false, {status: 500})

    const to = email,
      subject =  `Verify email address`,
      link = `${baseurl}/users/verify/${date}`,
      html = (new mailTemplates).verifyAccoutTemplate(link)
    const sendMail = await sendMailAsync(to, subject, html)
    if(sendMail.accepted.length < 1) return done(null, false, {status: 500})
    if(sendMail.accepted.length === 1) return done(null, false, {status: 201})
  }
  
  const isPasswordMatch = await bcrypt.compare(password.trim(), user.password)
  if(!isPasswordMatch) return done(null, false, {status: 400})
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
authroute.get('/join', authenticated, (req, res) => {
  res.render('index', {page: 'join'})
})
authroute.get('/login', authenticated, (req, res) => {
  res.render('index', {page: 'login'})
})
authroute.post('/join', authenticated,  async (req, res) => {
  let { body: {email, password, cpassword, firstname, surname} } = req,
        date = Date.now()

        email = email.trim()
        password = password.trim()
        cpassword = cpassword.trim()
        firstname = firstname.trim()
        surname = surname.trim()
        
  if(!email || !email.match(emailPattern)) return res.status(400).json({status: 400, msg: 'Invalid email format!'})

  if(cpassword !== password) return res.status(400).json({status: 400, msg: 'Passwords do not match!'})
  
  if(!firstname || !firstname.match(alpahanumericPattern)) return res.status(400).json({status: 400, msg: 'Firstname must only contain alphanumeric characters!'})

  if(!surname || !surname.match(alpahanumericPattern)) return res.status(400).json({status: 400, msg: 'Surname must only contain alphanumeric characters!'})
  
  const emailExists = await userModel.findOne({email})
  if(emailExists) return res.status(400).json({status: 400, msg: 'Email already exists'})
  
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
          sendMail = await sendMailAsync(subject, html, to)
          if(sendMail.accepted.length < 1) {
            userModel.findOneAndDelete({email})
            return res.status(400).json({status: 400, msg: 'An error occured, try again'})
          }
          if(sendMail.accepted.length === 1) return res.status(201).json({status: 201, msg: 'Account created, an email was sent to your address, click link to verify'})
      }
    })
    
})
authroute.post('/login', authenticated,  (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if(err) return next(err)
      
    if(info){
      if(info.status === 404) return res.status(404).json({status: 404, msg: 'Invalid credentials'})
      if(info.status === 400) return res.status(400).json({status: 400, msg: 'Incorrect password'})
      if(info.status === 500) return res.status(500).json({status: 500, msg: 'An error occured'})
      if(info.status === 201) return res.status(201).json({status: 201, msg: 'Verification email sent, check your email'})  
    }
    
    if(!user) return res.status(404).json({status: 404, msg: 'Invalid credentials'})
    
    req.logIn(user, (err) => {
      if(err) return next(err)
      return res.status(200).json({status: 200})
    })
  })
  (req, res, next)
})
authroute.get('/verify/:date', authenticated,  async (req, res) => {
  let verificationDetails = {}
  const verificationCode = req.params.date
    const findUser = await userModel.findOne({verificationCode})
    if(!findUser) verificationDetails = {status: 404, msg: 'Invalid credentials'}
    if(findUser && findUser.verified) verificationDetails = {status: 200, msg: 'Account already verified'}
    
    if(findUser && !findUser.verified){
      const updateVerificationStatus = await userModel.findOneAndUpdate({verificationCode}, {$set: {verified: true, verificationCode: ''}})
      if(!updateVerificationStatus) verificationDetails = {status: 400, msg: 'Error verifying your account'}
      if(updateVerificationStatus) verificationDetails = {status: 200, msg: 'Account verified successfully'}
    }

  res.render('index', {page: 'verifyemail', title: 'Verify email address', verificationDetails })
})
authroute.post('/resend', authenticated, async (req, res) => {
  const email = req.body.email.trim().toLowerCase(),
    isEmailMatch = email.match(emailPattern),
    date = Date.now()

  if(!isEmailMatch) return res.status(400).json({status: 400, msg: 'Invalid email format'})

  const findUser = await userModel.findOne({email})
  if(!findUser) return res.status(404).json({status: 404, msg: 'Enter the email you signed up with'})

  const verificationStatus = findUser.verified
  if(!verificationStatus) {
    const setVerificationCode = await userModel.findOneAndUpdate({email}, {$set: {verificationCode: date}})
    if(!setVerificationCode) return res.status(404).json({status: 404, msg: 'Error sending email'})
  }
  if(verificationStatus) return res.status(302).json({status: 302, msg: 'Email already verified'})

  const subject = 'Verify email address',
    link = `${baseurl}/users/verify/${date}`,
    html = (new mailTemplates).verifyAccoutTemplate(link),
    sendMail = await sendMailAsync(email, subject, html)

  if(sendMail.accepted.length < 1) return res.status(400).json({status: 400, msg: 'Error sending email'})
  if(sendMail.accepted.length === 1) return res.status(200).json({status: 200, msg: 'Email sent, check your inbox'})
})
authroute.get('/forgotpassword', async (req, res) => {
  res.status(200).render('index', {page: 'forgotpassword', title: 'Forgot password'})
})
authroute.post('/forgotpassword', async (req, res) => {
  const email = req.body.email.trim().toLowerCase(),
    isEmailMatch = email.match(emailPattern),
    date = Date.now()

    if(!isEmailMatch) return res.status(400).json({status: 400, msg: 'Invalid email format'})

    const findUser = await userModel.findOne({email})
    if(!findUser) return res.status(404).json({status: 404, msg: 'Invalid credentials'})

    const setVerificationCode = await userModel.findOneAndUpdate({email}, {$set: {verificationCode: date}})
    if(!setVerificationCode) return res.status(404).json({status: 404, msg: 'Error sending email'})

    const subject = 'Forgot password',
      link = `${baseurl}/users/forgotpassword/${date}`,
      html = (new mailTemplates).forgotPasswordTemplate(link),
      sendMail = await sendMailAsync(subject, html, email)
    if(sendMail && sendMail.accepted.length === 1) return res.status(200).json({status: 200, msg: 'Email sent, check your inbox'})
    
    return res.status(400).json({status: 400, msg: 'Error sending email'})
})
authroute.get('/forgotpassword/:verificationCode', async (req, res) => {
  let email = ''
  const verificationCode = req.params.verificationCode.trim()

  const findUser = await userModel.findOne({verificationCode})
  if(findUser) email = findUser.email
  res.status(200).render('index', {page: 'setforgotpassword', title: 'Change password', email: email})
})
authroute.post('/forgotpassword/newpassword', async (req, res) => {
  let { email, password, cpassword } = req.body
  email = email.trim().toLowerCase()
  password = password.trim()
  cpassword = cpassword.trim()

  if(password !== cpassword) return res.status(400).json({status: 400, msg: 'Passwords do not match'})
  const hashedPassword = await bcrypt.hash(password, 10)
  const updatePassword = await userModel.findOneAndUpdate({email}, {$set: {password: hashedPassword, verificationCode: ''}}, {new: true})
  if(!updatePassword) return res.status(500).json({status: 500, msg: 'An error occured'})
  return res.status(201).json({status: 201, msg: 'Password updated'})
})
authroute.get('/logout', (req, res) => {
  req.logOut(err => {
    if(err) return next(err)
    res.redirect('/')
  })
})
// authroute.post('/update', async (req, res) => {
//   userModel.updateOne({email: "ktindanzor@gmail.com"}, {$set: {admin: true}})
//     .then( async (result) => {
//       console.log(result)
//       if(!result) return res.sendStatus(400)
//       const user = await userModel.findOne({email: "ktindanzor@gmail.com"})
//       return res.status(200).send(user)
//       }
//     )
// })
export default authroute