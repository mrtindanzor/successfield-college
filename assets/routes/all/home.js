import { Router } from "express"

const homeroute = Router()

homeroute.get('/',  (req, res) => res.render('index', {page: 'home', title: 'SUCCESSFIELD COLLEGE'}))

export default homeroute