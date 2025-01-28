import express from 'express'
import { Router } from "express"
import passport from 'passport'
import bcrypt from 'bcrypt'
import { Strategy as localStrategy } from 'passport-local'
import { sendMailAsync }  from './sendmail.js'
import mailTemplates from './mailtemplates.js'
import { env, baseurl, userModel, authenticated, emailPattern, alpahanumericPattern, createStudentId } from '../../dependencies.js'
import { deletePhoto } from './upload.js'

const authroute = Router()

authroute.use(express.urlencoded({extended: false}))
passport.use(new localStrategy({usernameField: "email"}, async (email, password, done) => {
  email = email.trim().toLowerCase()
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
    const sendMail = await sendMailAsync(subject, html, to).catch(err => console.log(err))
    if(sendMail) if(sendMail.accepted.length === 1) return done(null, false, {status: 201})
    return done(null, false, {status: 500})
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

authroute.get('/', function(req, res){
  res.redirect('/')
})
authroute.patch('/', async function(req, res){
  const data = req.body
  if(!data.email){
    const users = await userModel.find({}).catch(err => res.status(500).json({msg: 'error occured while finding all users'}))
    return res.status(200).json(users)
  }
  if(data.operation){
    const deleteUser = await userModel.deleteOne({email: data.email})
    if(!deleteUser) res.status(500).json({status: 500, msg: 'Error deleting user'})
    return res.status(201).json(deleteUser)
  }
  const users = await userModel.find(data).catch(err => res.status(500).json({msg: `error occured while finding ${data} users`}))
  return res.status(200).json(users)
})
authroute.post('/join', authenticated,  async function(req, res){
  let {firstname, middlename, surname, email, password, cpassword } = req.body,
    date = Date.now()
    email = email.trim(), password = password.trim(), cpassword = cpassword.trim(), firstname = firstname.trim(), surname = surname.trim()
        
  const year = new Date().getFullYear(),
    day = new Date().getDate(),
    month = new Date().getMonth(),
    currentDate = `${day}-${month+1}-${year}`

  if(!email || !email.match(emailPattern)) return res.status(400).json({status: 400, msg: 'The email contains invalid characters'})

  if(cpassword !== password) return res.status(400).json({status: 400, msg: 'Passwords do not match!'})
  
  if(!firstname || !firstname.match(alpahanumericPattern)) return res.status(400).json({status: 400, msg: 'Firstname contains invalid characters'})

  if(!surname || !surname.match(alpahanumericPattern)) return res.status(400).json({status: 400, msg: 'Surname contains invalid characters'})
  
  if(middlename && !middlename?.match(alpahanumericPattern)) return res.status(400).json({status: 400, msg: 'Middle contains invalid characters'})

  const emailExists = await userModel.findOne({email})
  if(emailExists) return res.status(400).json({status: 400, msg: 'An account with this email already exists'})
  
  const  hashedPassword = await bcrypt.hash(password, 10),
    studentNumber = await createStudentId(userModel),
    userDetails = { firstname, middlename, surname, email, password: hashedPassword, studentNumber, date: currentDate, verificationCode: date, isnew: true },
    user = new userModel(userDetails)
  await user.save()
  if(!user.isNew) {
    const to = email,
      subject =  `Verify email address`,
      link = `${baseurl}/users/verify/${date}`,
      html = (new mailTemplates).verifyAccoutTemplate(link),
      sendMail = await sendMailAsync(subject, html, to).catch(err => console.log(err))
  if(sendMail?.accepted.length === 1) return res.status(201).json({status: 201, msg: 'Account created. Check your email to verify'})
  userModel.findOneAndDelete({email})
  return res.status(500).json({status: 500, msg: 'An error occured, try again'})
  }
})
authroute.post('/login', async function(req, res, next){
  passport.authenticate('local', async function(err, user, info){
    if(err) return next(err)
      
    if(info){
      if(info.status === 404) return res.status(404).json({status: 404, msg: 'Invalid credentials'})
      if(info.status === 400) return res.status(400).json({status: 400, msg: 'Incorrect password'})
      if(info.status === 500) return res.status(500).json({status: 500, msg: 'An error occured'})
      if(info.status === 201) return res.status(201).json({status: 201, msg: 'Verification email sent, check your email'})  
    }
    if(!user) return res.status(404).json({status: 404, msg: 'Invalid credentials'})
    if(req.isAuthenticated()){
      const isLoggedOut = await new Promise(function(resolve, reject){
        req.logOut(function(err){
          if(err) return reject(err)
          resolve()
        })
      })
      
    } 
    req.logIn(user, function(err) {
      if(err) return next(err)
      return res.status(200).json({status: 200})
    })
  })
  (req, res, next)
})
authroute.get('/verify/:confirmationCode',  async function(req, res){
  let verificationDetails = {}
  const verificationCode = req.params.confirmationCode,
    findUser = await userModel.findOne({verificationCode})
  if(!findUser) verificationDetails = {status: 404, msg: 'Invalid credentials'}
  if(findUser?.verified) verificationDetails = {status: 200, msg: 'Account already verified'}
    
  if(findUser && !findUser.verified){
    const updateVerificationStatus = await userModel.findOneAndUpdate({verificationCode}, {$set: {verified: true}}),
      admins = await userModel.find({admin: true})
    if(!updateVerificationStatus) verificationDetails = {status: 400, msg: 'Error verifying your account'}
    if(updateVerificationStatus){
      if(findUser?.isnew){
        const name = findUser.firstname + ' ' + findUser.surname,
          subject =  `New user verified`,
          html = (new mailTemplates).newUser(name, findUser.email)
        await sendMailAsync(subject, html)
        admins.forEach(async el => {
        let admin = el.firstname + ' ' + el.surname
        if(el.firstname.toLowerCase() == 'augustine') admin = 'Dr (clin) ' + admin
        const html = (new mailTemplates).newUser(name, findUser.email)
        await sendMailAsync(subject, html, el.email)
        })
        await userModel.findOneAndUpdate({email: findUser.email}, {$set: {isnew: false, verificationCode: ''}})
      }
    verificationDetails = {status: 200, msg: 'Account verified successfully'}
    } 
  }
  res.render('index', {page: 'verifyemail', title: 'Verify email address', verificationDetails })
})
authroute.post('/resend', async function(req, res){
  let email = req.body.email
  if(!email) return res.status(403).json({status: 403, msg: 'Enter a valid email address'})
  email = email.trim().toLowerCase()
  const isEmailMatch = email.match(emailPattern),
    date = Date.now()

  if(!isEmailMatch) return res.status(400).json({status: 400, msg: 'Invalid email format'})

  const findUser = await userModel.findOne({email})
  if(!findUser) return res.status(404).json({status: 404, msg: 'Enter the email you signed up with'})

  const verificationStatus = findUser.verified
  if(!verificationStatus) {
    const setVerificationCode = await userModel.findOneAndUpdate({email}, {$set: {verificationCode: date}})
    if(!setVerificationCode) return res.status(404).json({status: 404, msg: 'Error sending email'})
  }
  if(verificationStatus) return res.status(200).json({status: 200, msg: 'Email already verified'})

  const subject = 'Verify email address',
    link = `${baseurl}/users/verify/${date}`,
    html = (new mailTemplates).verifyAccoutTemplate(link),
    sendMail = await sendMailAsync(email, subject, html).catch(err => console.log(err))
  if(sendMail) if(sendMail.accepted.length === 1) return res.status(200).json({status: 200, msg: 'Email sent, check your inbox'})
  return res.status(400).json({status: 400, msg: 'Error sending email'})
})
authroute.get('/logout', function(req, res){
  req.logOut(function(err){
    if(err) return next(err)
    res.redirect('/')
  })
})
authroute.get('/forgotpassword', function(req, res){
  res.status(200).render('index', {page: 'passwordreset', section: 'request-password', title: 'Forgot password'})
})
authroute.post('/forgotpassword', async function(req, res){
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
    if(sendMail) if(sendMail.accepted.length === 1) return res.status(201).json({status: 201, msg: 'Email sent, check your inbox'})
    return res.status(400).json({status: 400, msg: 'Error sending email'})
})
authroute.patch('/forgotpassword/newpassword', async function(req, res){
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
authroute.get('/forgotpassword/:verificationCode', async function(req, res){
  let email = ''
  const verificationCode = req.params.verificationCode.trim()

  const findUser = await userModel.findOne({verificationCode})
  if(findUser) email = findUser.email
  res.status(200).render('index', {page: 'passwordreset', section: 'set-password', title: 'Change password', email})
})
authroute.get('/:auth', authenticated, function(req, res, next){
  const route = req.params.auth.toLowerCase().trim()
  if(route === 'join') return res.status(200).render('index', {page: 'join', title: 'Create account'})
  if(route === 'login' || req.query.switch === 'true') return res.status(200).render('index', {page: 'login', title: 'Members Area'})
})
authroute.delete('/delete', async function(req, res){
  const { email } = req.body,
  findUser = await userModel.findOne({email})
  if(!findUser) return res.status(404).json({status: 404, msg: 'user not found'})
  if(findUser.image){
    await deletePhoto(findUser.image.publicId)
  }
  const user = await userModel.findOneAndDelete({email})
  if(!user) return res.status(500).json({status: 500, msg: 'could not delete'})
  return res.status(200).json({status: 200, msg: 'deleted'})
})
authroute.patch('/update-user', async function(req, res){
  const { email } = req.body,
    findUser = await userModel.findOne({email})
  if(!findUser) return res.status(404).json({status: 404, msg: 'user not found'})
  const user = await userModel.findOneAndUpdate({email}, {$set: {verified: true, admin: true}})
  if(!user) return res.status(500).json({status: 500, msg: 'could not update'})
  return res.status(200).json({status: 200, msg: 'updated'})
})

export default authroute
