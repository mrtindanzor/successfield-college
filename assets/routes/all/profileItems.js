import { Router } from "express";
import bcrypt from 'bcrypt'
import { emailPattern, alpahanumericPattern, userModel, numberPattern, env  } from "../../../dependencies.js"
import { sendMailAsync } from "./sendmail.js";
import mailTemplates from "./mailtemplates.js";
const profileItemsRoute = Router()

let email
profileItemsRoute.use('/', setEmail)
profileItemsRoute.get('/account-information/:route', (req, res, next) => {
  const route = req.params.route.toLowerCase().trim(),
  user = req.user

  if(route === 'username') return res.render('index', {page: 'accountinfo', title: 'Edit name', section: 'username', user})
  if(route === 'phone number') return res.render('index', {page: 'accountinfo', title: 'Edit phone number', section: 'phone', user})
  if(route === 'email') return res.render('index', {page: 'accountinfo', title: 'Edit email address', section: 'email', user})
  if(route === 'region') return res.render('index', {page: 'accountinfo', title: 'Country and Region', section: 'region', user})
  if(route === 'change password') return res.render('index', {page: 'accountinfo', title: 'Change password', section: 'password', user})
})
profileItemsRoute.patch('/account-information/:route', async (req, res, next) => {
  const route = req.params.route.toLowerCase().trim()
  
  if(route === 'username'){
    const { firstname, middlename, surname } = req.body,
      user = req.user
    if(user.namechanged === true) return res.status(403).json({status: 403, msg: 'Name edits allowed exceeded, contact support to change name'})
    if(!firstname || !surname) return res.status(400).json({status: 400, msg: 'Enter a valid name'})
    if((firstname.toLowerCase() === user.firstname.toLowerCase() && surname.toLowerCase() === user.surname.toLowerCase()) && (middlename?.toLowerCase() === user.middlename?.toLowerCase())) return res.status(400).json({status: 400, msg: 'Name was not altered'})
    if(!firstname.match(alpahanumericPattern) || !surname.match(alpahanumericPattern)) return res.status(400).json({status: 400, msg: 'Invalid characters'})
    let newName = {firstname, middlename, surname, namechanged: true}
    const result = await userModel.findOneAndUpdate({email}, {$set: newName}, {new: true})
    if(!result) return res.status(403).json({status: 403, msg: 'Error occured while updating name'})
    return res.status(201).json({status: 201, msg: 'Name updated successfully'})
  }
  if(route === 'changepassword'){
    const {oldpassword, password, cpassword} = req.body
    if(!oldpassword || !password || !cpassword) return res.status(403).json({status: 403, msg: 'Enter valid passwords'})
    if(password !== cpassword) return res.status(403).json({status: 403, msg: 'New passwords do not match'})
    const isPasswordMatch = await bcrypt.compare(oldpassword.trim(), req.user.password)
    const isOldPasswordMatchNewPassword = await bcrypt.compare(password.trim(), req.user.password)
    if(!isPasswordMatch) return res.status(401).json({status: 401, msg: 'Old password is not correct'})
    if(isOldPasswordMatchNewPassword) return res.status(403).json({status: 403, msg: 'You cannot use an old password'})
    const hashedPassword = await bcrypt.hash(password, 10)
    const updatePassword = await userModel.findOneAndUpdate({email}, {$set: {password: hashedPassword}}, {new: true})
    if(!updatePassword) return res.status(500).json({status: 500, msg: 'An error occured'})
    return res.status(201).json({status: 201, msg: 'Password updated'})
  }
  if(route === 'phonenumber'){
    const {phone} = req.body
    if(!phone) return res.status(403).json({status: 403, msg: 'Enter a valid phone number'})
    if(!phone.match(numberPattern)) return res.status(403).json({status: 403, msg: 'Phone number must only contain digits'})
    const updatePhone = await userModel.findOneAndUpdate({email}, {$set: {phone}}, {new: true})
    if(!updatePhone) return res.status(403).json({status: 403, msg: 'An error occured'})
    return res.status(201).json({status: 201, msg: 'Phone number updated'})
  }
  if(route === 'email'){
    const newEmail = req.body.email,
      date = Date.now()
    if(!newEmail) return res.status(403).json({status: 403, msg: 'Enter a valid email'})
    if(!newEmail.match(emailPattern)) return res.status(403).json({status: 403, msg: 'Enter a valid email format'})
    if(newEmail === email) return res.status(403).json({status: 403, msg: 'You are already using this email address'})
    const emailExists = await userModel.findOne({email: newEmail})
    if(emailExists) return res.status(403).json({status: 403, msg: 'Email already exists'})
    const updateEmail = await userModel.findOneAndUpdate({email}, {$set: {email: newEmail, verified: false, verificationCode: date}}, {new: true})
    if(!updateEmail) return res.status(500).json({status: 500, msg: 'An error occured'})
    const to = newEmail,
      subject =  `Verify email address`,
      link = `${env.baseurl}/users/verify/${date}`,
      html = (new mailTemplates).verifyAccoutTemplate(link),
      sendMail = await sendMailAsync(subject, html, to).catch(err => console.log(err))
    if(sendMail?.accepted.length === 1) return res.status(201).json({status: 201, msg: 'Email updated, verify using the link sent to email address'})
    await userModel.findOneAndUpdate({email}, {$set: {email, verified: true}})
    return res.status(500).json({status: 500, msg: 'An error occured'})
  }
  if(route === 'region'){
    return
  }
  next()
})
function setEmail(req, res, next){
  email = req.user.email
  next()
}

export default profileItemsRoute