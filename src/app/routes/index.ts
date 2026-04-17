import { Router } from "express"
import { ParcelRoutes } from "../module/parcel/parcel.route"
import { AuthRoutes } from "../module/auth/auth.route"

const router = Router()

router.use('/auth', AuthRoutes)
router.use('/parcels', ParcelRoutes)


export const IndexRoutes = router