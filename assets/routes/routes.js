import { Router } from "express";
import homeroute from "./all/home.js";
import authroute from "./all/auth.js";
import contactroute from "./all/contact.js";
import verifyroute from "./all/verify.js";
import courseRoute from "./all/course.js";
import { adminRoute } from "./all/admin.js";
import accreditationRoute from "./all/accreditation.js";
import uploadRoute from "./all/upload.js";
import profileRoute from "./all/profile.js";
import partnerRoute from "./all/partner.js";

const router = Router()
router.use(homeroute)
router.use('/users', authroute)
router.use(contactroute)
router.use(verifyroute)
router.use(courseRoute)
router.use(adminRoute)
router.use(accreditationRoute)
router.use(uploadRoute)
router.use(profileRoute)
router.use(partnerRoute)

export default router