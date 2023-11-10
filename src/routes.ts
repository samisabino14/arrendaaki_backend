import { Router } from "express";

import { typologyRoutes } from "./routes/typology";
import { provinceRoutes } from "./routes/province";
import { countyRoutes } from "./routes/county";
import { districtRoutes } from "./routes/district";
import { localityRoutes } from "./routes/locality";
import { personRoutes } from "./routes/person";
import { typeOfAccountRoutes } from "./routes/typeOfAccount";
import { accountRoutes } from "./routes/account";
import { accountTypeOfAccountRoutes } from "./routes/AccountTypeOfAccount";
import { residenceRoutes } from "./routes/residence";
import { photoRoutes } from "./routes/photo";
import { typeOfContractRoutes } from "./routes/typeofcontract";
import { contractRoutes } from "./routes/contract";


const router = Router();

router.use(typologyRoutes)
router.use(provinceRoutes)
router.use(countyRoutes)
router.use(districtRoutes)
router.use(localityRoutes)
router.use(personRoutes)
router.use(typeOfAccountRoutes)
router.use(accountRoutes)
router.use(accountTypeOfAccountRoutes)
router.use(residenceRoutes)
router.use(photoRoutes)
router.use(typeOfContractRoutes)
router.use(contractRoutes)


export { router }