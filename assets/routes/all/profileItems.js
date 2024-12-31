import { Router } from "express";

const profileItemsRoute = Router()

profileItemsRoute.get('/account-information/:route', (req, res, next) => {
  const route = req.params.route.toLowerCase().trim(),
  user = req.user

  if(route === 'username') return res.render('index', {page: 'accountinfo', title: 'Edit name', section: 'username', user})
  if(route === 'phone number') return res.render('index', {page: 'accountinfo', title: 'Edit phone number', section: 'phone', user})
  if(route === 'email') return res.render('index', {page: 'accountinfo', title: 'Edit email address', section: 'email', user})
  if(route === 'region') return res.render('index', {page: 'accountinfo', title: 'Country and Region', section: 'region', user})
  if(route === 'change password') return res.render('index', {page: 'accountinfo', title: 'Change password', section: 'password', user})
  next()
})

export default profileItemsRoute