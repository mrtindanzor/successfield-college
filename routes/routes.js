import { Router } from "express";
import homeroute from "./all/home.js";
import authroute from "./all/auth.js";
import contactroute from "./all/contact.js";
import verifyroute from "./all/verify.js";
import { showCourseRoute } from "./all/course.js";
import { adminRoute } from "./all/admin.js";
import accreditationRoute from "./all/accreditation.js";
import { uploadRoute } from "./all/upload.js";
import { showPartnerRoute } from "./all/partner.js";
import profileRoute from "./all/profile.js";
import profileItemsRoute from "./all/profileItems.js";
import { isNotAuthenticated } from "../dependencies.js";
import { purchaseCourseRoute } from "./all/purchase.js";

const router = Router()
router.use(homeroute)
router.use('/users', profileRoute)
router.use('/users', authroute)
router.use('/users', isNotAuthenticated, profileItemsRoute)
router.use(contactroute)
router.use(verifyroute)
router.use(purchaseCourseRoute)
router.use(showCourseRoute)
router.use(adminRoute)
router.use(accreditationRoute)
router.use(uploadRoute)
router.use(showPartnerRoute)

export default router