import { Router } from "express";
import { partnerModel, isAdmin, userModel } from "../../../dependencies.js";

const partnerRoute = Router(),
  showPartnerRoute = Router()

partnerRoute.get('/partner/:param', (req, res) => {
  const param = req.params.param
  if(param === 'add') return res.status(200).render('index', {page: 'partner', section: 'add', title: 'Add new partner'})
  if(param === 'edit') return res.status(200).render('index', {page: 'partner', section: 'edit', title: 'Edit partner'})
  if(param === 'delete') return res.status(200).render('index', {page: 'partner', section: 'delete', title: 'Delete partner'})
})

showPartnerRoute.get('/partners', async (req, res) => {
  const partners = await partnerModel.find({}).catch(err => console.log(err))
  if(partners.length < 1) return res.redirect('/')
  res.render('index', {page: 'partner', section: 'show', title: 'Training Partners', partners})
})

partnerRoute.put('/partner', async (req, res) => {
  const partner = req.body,
    name = partner.name,
    partnerId = partner.partnerId

  if(!name || !partnerId) return res.status(400).json({status: 400, msg: 'Enter valid details'})
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

partnerRoute.post('/partner', async (req, res) => {
  const partnerId = req.body
  
  if(!partnerId) return res.status(400).json({status: 400, msg: 'Enter valid details'})
  const partner = await partnerModel.findOne(partnerId)
  if(!partner) return res.status(404).json({status: 404, msg: 'No partner found with ID: '+partnerId.partnerId})
  return res.status(200).json({status: 200, ...partner._doc})
})

partnerRoute.patch('/partner', async (req, res) => {
  const partner = req.body,
    name = partner.name,
    partnerId = partner.partnerId,
    oldId = partner.oldApproval

  if(!name || !partnerId) return res.status(400).json({status: 400, msg: 'Enter valid details'})
  
  const isPartnerId = await partnerModel.findOne({partnerId})
  if(isPartnerId && (isPartnerId.partnerId !== oldId)) return res.status(400).json({status: 400, msg: 'Partner ID already exists'})
  delete partner.oldApproval
  const updated = await partnerModel.findOneAndUpdate({partnerId: oldId}, partner, {new: true})
  if(!updated) return res.status(500).json({status: 500, msg: 'An error occured'})
  return res.status(201).json({status: 2071, msg: 'Partner updated successfully'})
})

partnerRoute.delete('/partner', async (req, res) => {
  const partnerId = req.body.partnerId.trim().toLowerCase()

  if(!partnerId) return res.status(400).json({status: 400, msg: 'Invalid partnerId'})
  const isDeleted = await findOneAndDelete({partnerId})
  if(!isDeleted) return res.status(500).json({status: 500, msg: 'An error occured'})
  return res.status(200).json({status: 200, msg: 'Deleted successfully'})
})

export { showPartnerRoute, partnerRoute }  