import { Router } from "express";
import homeroute from "./all/home.js";
import contactroute from "./all/contact.js";
import verifyroute from "./all/verify.js";
import testroute from "./all/test.js";
import courseRoute from "./all/course.js";

const router = Router()

router.use(homeroute)
router.use(contactroute)
router.use(verifyroute)
router.use(testroute)
router.use(courseRoute)

export default router