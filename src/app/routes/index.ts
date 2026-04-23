import { Router } from "express"
import { ParcelRoutes } from "../module/parcel/parcel.route"
import { AuthRoutes } from "../module/auth/auth.route"
import { UserRoutes } from "../module/user/user.route"
import { AddressRoutes } from "../module/address/address.route"
import { RiderRoutes } from "../module/rider/rider.route"
import { PaymentRoutes } from "../module/payment"
import { AnalyticsRoutes } from "../module/analytics/routes/analytics.route"
import { RatingRoutes } from "../module/rating/routes/rating.route"

const router = Router()

router.use('/auth', AuthRoutes)
router.use('/parcels', ParcelRoutes)
router.use('/users', UserRoutes)
router.use('/addresses', AddressRoutes)
router.use('/rider', RiderRoutes)
router.use('/payments', PaymentRoutes)
router.use('/analytics', AnalyticsRoutes)
router.use('/ratings', RatingRoutes)


export const IndexRoutes = router