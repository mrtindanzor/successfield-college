import { Router } from "express";
import { uploadPath } from "../../../app.js";
import fs from 'fs'

const uploadRoute = Router()
uploadRoute.get('/upload', (req, res) => {
  res.render('index', {page: 'upload', title: 'upload images'})
})
uploadRoute.put('/upload', (req, res) => {
  if(!req.body.picture) return res.status(400).json({status: 400, msg: 'No image sent'})
  return res.status(200).json({status: 400, msg: 'image sent'})
})

export default uploadRoute