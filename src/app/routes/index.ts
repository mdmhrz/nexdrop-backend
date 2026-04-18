import { Router } from "express"
import { ParcelRoutes } from "../module/parcel/parcel.route"
import { AuthRoutes } from "../module/auth/auth.route"
import { UserRoutes } from "../module/user/user.route"

const router = Router()

router.use('/auth', AuthRoutes)
router.use('/parcels', ParcelRoutes)
router.use('/users', UserRoutes)


export const IndexRoutes = router