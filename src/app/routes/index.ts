import { Router } from "express"
import { ParcelRoutes } from "../module/parcel/parcel.route"
import { AuthRoutes } from "../module/auth/auth.route"
import { UserRoutes } from "../module/user/user.route"
import { AddressRoutes } from "../module/address/address.route"

const router = Router()

router.use('/auth', AuthRoutes)
router.use('/parcels', ParcelRoutes)
router.use('/users', UserRoutes)
router.use('/addresses', AddressRoutes)


export const IndexRoutes = router