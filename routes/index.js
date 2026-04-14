import { Router } from "express";
import adminRouter from "./admin.route.js";
import userAuth from "../middlewares/userAuth.js";
import adminController from "../controllers/admin.controller.js";
import employeeRouter from "./employee.route.js";

const router= Router();
router.get('/', (req, res) => {
    res.redirect('/admin/signup');
});
router.use('/admin',adminRouter)
router.use('/employee', employeeRouter)

export default router;  