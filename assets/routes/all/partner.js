import { Router } from "express";
import { partnerModel, isAdmin, userModel } from "../../../dependencies.js";

const partnerRoute = Router()

partnerRoute.get('/partners', async (req, res) => {
  const partners = await partnerModel.find({}).catch(err => console.log(err))
  if(partners.length < 1) return res.redirect('/')
  res.render('index', {page: 'partner', title: 'Training Partners', partners})
})

partnerRoute.put('/partners', async (req, res) => {
  const partner = req.body,
    name = partner.name

  if(!name) return res.status(400).json({msg: 'Enter valid details'})

  const partnerChar = new partnerModel(partner)
  partnerChar.save()
  if(!partnerChar.isNew){
    partnerChar.deleteOne()
    return res.status(500).json({msg: 'Error adding partner'})
  } 
  
  return res.status(201).json({msg: 'Partner added successfully'})
})

export default partnerRoute