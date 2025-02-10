import { Router } from "express"
import { sendMailAsync } from "./sendmail.js"

const homeroute = Router()

homeroute.get('/',  (req, res) => res.render('index', {page: 'home', title: 'SUCCESSFIELD COLLEGE'}))

export default homeroute