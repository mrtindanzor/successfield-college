import { Router } from "express";

const contactroute = Router()

contactroute.get('/contact', (req, res) => res.render('index', {page: 'contact'}))

export default contactroute