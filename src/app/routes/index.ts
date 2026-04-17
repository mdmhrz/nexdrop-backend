import { Router } from "express"
import { ParcelRoutes } from "../module/parcel/parcel.route"

const router = Router()

router.use('/parcels', ParcelRoutes)


export const IndexRoutes = router