import { Router } from "express";
import homeroute from "./all/home.js";
import contactroute from "./all/contact.js";
import verifyroute from "./all/verify.js";
import testroute from "./all/test.js";
import courseRoute from "./all/course.js";
import { certaddRoute } from "./all/certadd.js";
import adminRoute from "./all/admin.js";
import updatecertRoute from "./all/updatecert.js";
import addcourseRoute from "./all/addcourse.js";
import editcourseRoute from "./all/editcourse.js";

const router = Router()

router.use(homeroute)
router.use(contactroute)
router.use(verifyroute)
router.use(testroute)
router.use(courseRoute)
router.use(certaddRoute)
router.use(adminRoute)
router.use(updatecertRoute)
router.use(addcourseRoute)
router.use(editcourseRoute)

export default router