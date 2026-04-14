import { Router } from "express";
import employeeController from "../controllers/employee.controller.js";
import userAuth from "../middlewares/userAuth.js";

const employeeRouter = Router();

employeeRouter.get('/dashboard', userAuth, employeeController.dashboard);

employeeRouter.get('/tasks', userAuth, employeeController.viewTasks);

// START TASK
employeeRouter.get('/start/:id', userAuth, employeeController.startTask);

// REQUEST COMPLETE
employeeRouter.get('/complete-request/:id', userAuth, employeeController.requestComplete);

export default employeeRouter;