import { Router } from "express";
import { uploadPath } from "../../../app.js";
import multer from  "multer"
import fs from 'fs'

const uploadRoute = Router(),
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      const token = Date.now(),
      split = file.originalname.split('.'),
      ext = '.' + split[split.length - 1],
      name = token+ext

      cb(null, name)
    }
  }),
  upload = multer({ storage })
  
uploadRoute.get('/upload', (req, res) => {
  res.render('index', {page: 'upload', title: 'upload images'})
})
uploadRoute.put('/upload', upload.single('picture'), (req, res) => {
  if(!req.picture) return res.status(400).json({status: 400, msg: 'No image sent'})
  return res.status(200).json({status: 400, msg: 'image sent'})
})

export default uploadRoute