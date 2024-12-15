import { Router } from "express";
import homeroute from "./all/home.js";
import contactroute from "./all/contact.js";
import verifyroute from "./all/verify.js";
import testroute from "./all/test.js";
import courseRoute from "./all/course.js";
import { adminRoute } from "./all/admin.js";
import accreditationRoute from "./all/accreditation.js";

const router = Router()
router.use(homeroute)
router.use(contactroute)
router.use(verifyroute)
router.use(testroute)
router.use(courseRoute)
router.use(adminRoute)
router.use(accreditationRoute)

export default router