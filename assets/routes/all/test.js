import { Router } from "express";

const testroute = Router()

testroute.get('/test', (req, res) => {
  res.render('index', {page: "test", title: 'test'})
})

export default testroute