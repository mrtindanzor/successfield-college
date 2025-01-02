import { Router } from "express";
import multer from  "multer"
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { env, uploadPath, imageModel, userModel } from "../../../dependencies.js";


const CLOUDINARY_NAME = env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY = env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET = env.CLOUDINARY_API_SECRET,
  cloudinaryKeys = { cloud_name: CLOUDINARY_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET},
  uploadRoute = Router(),
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      const token = Date.now(),
      split = file.originalname.split('.'),
      ext = '.' + split[split.length - 1],
      name = "successfieldcollege"+token+ext
      cb(null, name)
    }
  }),
  upload = multer({ storage })

  cloudinary.config(cloudinaryKeys)
uploadRoute.put('/upload', upload.single('image'), async (req, res) => {
  if(!req.file) return res.status(400).json({status: 400, msg: 'No image sent'})

  const file = req.file,
    path = file.path,
    havePublicId = req.user.image.publicId
    console.log(havePublicId)
  if(havePublicId) await deletePhoto(havePublicId)

  const upload = await cloudinary.uploader.upload(path).catch(err => console.log(err))

  fs.unlinkSync(path)

  if(!upload) return res.status(500).json({status: 500})
  const url = upload.url,
    publicId = upload.public_id
  return res.status(201).json({status: 201, url, publicId})
})
uploadRoute.delete('/deletephoto', async function(req, res){
  const publicId = req.body
  await deletePhoto(publicId)
  return res.status(201).json({status: 201, msg: 'Image deleted'})
})
async function deletePhoto (publicId){
 cloudinary.uploader.destroy(publicId).catch(err => console.log(err))
}
export default uploadRoute