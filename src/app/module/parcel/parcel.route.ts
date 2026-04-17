import {Router} from "express"

const router = Router()


router.get('/', (_, res) => {
    res.json({message: 'Parcel route'})
})

export const ParcelRoutes = router