import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import Task from '../models/task.model.js';

const adminController = {

    // ================= DASHBOARD =================
    dashboard(req, res) {
        if (!req.user) return res.redirect('/admin/login');

        res.render('pages/admin/dashboard', {
            user: req.user
        });
    },

    // ================= AUTH =================
    signupPage(req, res) {
        res.render('pages/admin/signup');
    },

    async signup(req, res) {
        try {
            const { password } = req.body;

            req.body.password = await bcrypt.hash(password, 10);
            req.body.role = 'admin';

            await User.create(req.body);

            return res.redirect('/admin/login');
        } catch (error) {
            console.error(error);
        }
    },

    loginPage(req, res) {
        res.render('pages/admin/login');
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) return res.redirect('/admin/login');

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.redirect('/admin/login');

            const token = jwt.sign({
                id: user._id,
                name: user.name,
                role: user.role
            }, 'secret', { expiresIn: '1d' });

            res.cookie('token', token);

            // 🔥 ROLE BASED REDIRECT
            if (user.role === 'admin' || user.role === 'manager') {
                return res.redirect('/admin/dashboard');
            } else {
                return res.redirect('/employee/dashboard');
            }

        } catch (error) {
            console.error(error);
        }
    },

    logout(req, res) {
        res.clearCookie('token');
        return res.redirect('/admin/login');
    },

    // ================= EMPLOYEE / MANAGER =================
    createEmployeePage(req, res) {
        res.render('pages/admin/createEmployee', {
            user: req.user
        });
    },

    async createEmployee(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).send('Only Admin Allowed');
            }

            const { password, role } = req.body;

            req.body.password = await bcrypt.hash(password, 10);
            req.body.role = role || 'employee'; // employee OR manager

            await User.create(req.body);

            return res.redirect('/admin/viewEmployees');
        } catch (error) {
            console.error(error);
        }
    },

    async viewEmployees(req, res) {
        const employees = await User.find({
            role: { $in: ['employee', 'manager'] }
        });

        res.render('pages/admin/viewEmployees', {
            employees,
            user: req.user
        });
    },

    async deleteEmployee(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).send('Only Admin Allowed');
        }

        await User.findByIdAndDelete(req.params.id);
        return res.redirect('/admin/viewEmployees');
    },

    async editEmployeePage(req, res) {
        const employee = await User.findById(req.params.id);

        res.render('pages/admin/editEmployee', {
            employee,
            user: req.user
        });
    },

    async editEmployee(req, res) {
        const { password } = req.body;

        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }

        await User.findByIdAndUpdate(req.params.id, req.body);
        return res.redirect('/admin/viewEmployees');
    },

    // ================= TASK =================
    async addTaskPage(req, res) {
        const employees = await User.find({
            role: { $in: ['employee', 'manager'] }
        });

        res.render('pages/admin/addTask', {
            employees,
            user: req.user
        });
    },

    async addTask(req, res) {
        const { name, description, assignedTo } = req.body;

        await Task.create({
            name,
            description,
            assignedTo,
            createdBy: req.user.id
        });

        return res.redirect('/admin/viewTasks');
    },

    async viewTasks(req, res) {
        const search = req.query.search || '';

        let query = {
            name: { $regex: search, $options: 'i' }
        };

        // 👇 employee only own tasks
        if (req.user.role === 'employee') {
            query.assignedTo = req.user.id;
        }

        const tasks = await Task.find(query)
            .populate('createdBy')
            .populate('assignedTo');

        res.render('pages/admin/viewTasks', {
            tasks,
            user: req.user,
            search
        });
    },

    async editTaskPage(req, res) {
        const task = await Task.findById(req.params.id);
        const employees = await User.find({
            role: { $in: ['employee', 'manager'] }
        });

        res.render('pages/admin/editTask', {
            task,
            employees,
            user: req.user
        });
    },

    async editTask(req, res) {
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            return res.status(403).send('Access Denied');
        }

        await Task.findByIdAndUpdate(req.params.id, req.body);
        return res.redirect('/admin/viewTasks');
    },

    async deleteTask(req, res) {
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            return res.status(403).send('Access Denied');
        }

        await Task.findByIdAndDelete(req.params.id);
        return res.redirect('/admin/viewTasks');
    },

    async approveTask(req, res) {
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            return res.status(403).send('Access Denied');
        }

        await Task.findByIdAndUpdate(req.params.id, {
            status: 'completed'
        });

        return res.redirect('/admin/viewTasks');
    }

};

export default adminController;