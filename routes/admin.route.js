import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import userAuth from "../middlewares/userAuth.js";

const adminRouter = Router();

adminRouter.get('/signup', adminController.signupPage);
adminRouter.post('/signup', adminController.signup);

adminRouter.get('/login', adminController.loginPage);
adminRouter.post('/login', adminController.login);

adminRouter.get('/logout', userAuth, adminController.logout);

adminRouter.get('/dashboard', userAuth, adminController.dashboard);

adminRouter.get('/createEmployee', userAuth, adminController.createEmployeePage);
adminRouter.post('/createEmployee', userAuth, adminController.createEmployee);

adminRouter.get('/viewEmployees', userAuth, adminController.viewEmployees);

adminRouter.get('/deleteEmployee/:id', userAuth, adminController.deleteEmployee);

adminRouter.get('/editEmployee/:id', userAuth, adminController.editEmployeePage);
adminRouter.post('/editEmployee/:id', userAuth, adminController.editEmployee);

adminRouter.get('/addTask', userAuth, adminController.addTaskPage);
adminRouter.post('/addTask', userAuth, adminController.addTask);

adminRouter.get('/viewTasks', userAuth, adminController.viewTasks);

adminRouter.get('/editTask/:id', userAuth, adminController.editTaskPage);
adminRouter.post('/editTask/:id', userAuth, adminController.editTask);

adminRouter.get('/deleteTask/:id', userAuth, adminController.deleteTask);
adminRouter.get('/approve/:id', userAuth, adminController.approveTask);
adminRouter.get('/task-requests', userAuth, adminController.viewRequests);

export default adminRouter;