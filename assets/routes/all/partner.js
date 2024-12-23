import { Router } from "express";
import { partnerModel, isAdmin, userModel } from "../../../dependencies.js";

const partnerRoute = Router(),
  showPartnerRoute = Router()

partnerRoute.get('/addpartner', (req, res) => {
  res.status(200).render('index', {page: 'addpartner', title: 'Add new partner'})
})
partnerRoute.get('/editpartner', async (req, res) => {
  res.status(200).render('index', {page: 'editpartner', title: 'Edit Partner'})
})

showPartnerRoute.get('/partners', async (req, res) => {
  const partners = await partnerModel.find({}).catch(err => console.log(err))
  if(partners.length < 1) return res.redirect('/')
  res.render('index', {page: 'partner', title: 'Training Partners', partners})
})

partnerRoute.put('/partner', async (req, res) => {
  const partner = req.body,
    name = partner.name,
    partnerId = partner.partnerId

  if(!name) return res.status(400).json({status: 400, msg: 'Enter valid details'})
  const isId = await partnerModel.findOne({partnerId})
  if(isId) return res.status(400).json({status: 400, msg: 'Partner ID already exists'})
  const partnerChar = new partnerModel(partner)
  partnerChar.save()
  if(!partnerChar.isNew){
    partnerChar.deleteOne()
    return res.status(500).json({status: 500, msg: 'Error adding partner'})
  }
  return res.status(201).json({status: 201, msg: 'Partner added successfully'})
})

partnerRoute.post('/findpartner', async (req, res) => {
  const partnerId = req.body
  
  if(!partnerId) return res.status(400).json({status: 400, msg: 'Enter valid details'})
  const partner = await partnerModel.findOne(partnerId)
  if(!partner) return res.status(404).json({status: 404, msg: 'No partner found with '+partnerId.partnerId})
  return res.status(201).json({status: 201, partner})
})

partnerRoute.put('/editpartner', async (req, res) => {
  const partner = req.body,
    name = partner.name,
    partnerId = partner.partnerId

  if(!name) return res.status(400).json({status: 400, msg: 'Enter valid details'})
  const updated = await partnerModel.findOneAndUpdate({partnerId}, partner, {new: true})
  if(!updated) return res.status(500).json({status: 500, msg: 'An error occured'})
  return res.status(201).json({status: 201, msg: 'Partner updated successfully'})
})

export { showPartnerRoute, partnerRoute }  