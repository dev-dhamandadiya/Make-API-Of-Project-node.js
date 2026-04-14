import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import Task from '../models/task.model.js';

const adminController = {

    dashboard(req, res) {
        if (!req.user) return res.redirect('/admin/login');

        res.render('pages/admin/dashboard', {
            user: req.user
        });
    },

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
            res.status(500).send('Error creating admin');
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

            const token = jwt.sign(
                {
                    id: user._id,
                    name: user.name,
                    role: user.role
                },
                'secret',
                { expiresIn: '1d' }
            );

            res.cookie('token', token);

            if (user.role === 'admin') {
                return res.redirect('/admin/dashboard');
            } else if (user.role === 'employee') {
                return res.redirect('/employee/dashboard');
            } else {
                return res.redirect('/admin/login');
            }

        } catch (error) {
            console.error(error);
            return res.redirect('/admin/login');
        }
    },

    logout(req, res) {
        res.clearCookie('token');
        return res.redirect('/admin/login');
    },

    createEmployeePage(req, res) {
        res.render('pages/admin/createEmployee');
    },

    async createEmployee(req, res) {
        try {
            const { password } = req.body;

            req.body.password = await bcrypt.hash(password, 10);
            req.body.role = 'employee';

            await User.create(req.body);

            return res.redirect('/admin/viewEmployees');

        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating employee');
        }
    },

    async viewEmployees(req, res) {
        try {
            const employees = await User.find({ role: 'employee' });

            res.render('pages/admin/viewEmployees', {
                employees
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching employees');
        }
    },

    async editEmployeePage(req, res) {
        try {
            const employee = await User.findById(req.params.id);

            res.render('pages/admin/editEmployee', {
                employee
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching employee');
        }
    },

    async editEmployee(req, res) {
        try {
            const { password } = req.body;

            if (password) {
                req.body.password = await bcrypt.hash(password, 10);
            }

            await User.findByIdAndUpdate(req.params.id, req.body);

            return res.redirect('/admin/viewEmployees');

        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating employee');
        }
    },

    async deleteEmployee(req, res) {
        try {
            await User.findByIdAndDelete(req.params.id);

            return res.redirect('/admin/viewEmployees');

        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting employee');
        }
    },

    async addTaskPage(req, res) {
        try {
            const employees = await User.find({ role: 'employee' });

            res.render('pages/admin/addTask', {
                employees
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error loading page');
        }
    },

    async addTask(req, res) {
        try {
            const { name, description, assignedTo } = req.body;

            await Task.create({
                name,
                description,
                assignedTo,
                createdBy: req.user.id
            });

            return res.redirect('/admin/viewTasks');

        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating task');
        }
    },

    async viewTasks(req, res) {
        try {
            const search = req.query.search || '';
            const page = parseInt(req.query.page) || 1;
            const limit = 5;
            const skip = (page - 1) * limit;

            let query = {
                name: { $regex: search, $options: 'i' }
            };

            if (req.user.role === 'employee') {
                query.assignedTo = req.user.id;
            }

            const tasks = await Task.find(query)
                .populate('createdBy')
                .populate('assignedTo')
                .skip(skip)
                .limit(limit);

            res.render('pages/admin/viewTasks', {
                tasks,
                user: req.user,
                search,
                currentPage: page,
                user: req.user
            });

        } catch (error) {
            console.log(error);
            res.status(500).send("Error loading tasks");
        }
    },

    async editTaskPage(req, res) {
        try {
            const task = await Task.findById(req.params.id);
            const employees = await User.find({ role: 'employee' });

            res.render('pages/admin/editTask', {
                task,
                employees
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching task');
        }
    },

    async editTask(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).send('Access Denied');
            }

            const { name, description, assignedTo, createdBy } = req.body;

            await Task.findByIdAndUpdate(req.params.id, {
                name,
                description,
                assignedTo,
                createdBy
            });

            return res.redirect('/admin/viewTasks');

        } catch (error) {
            console.error(error);
            res.status(500).send('Error updating task');
        }
    },

    async deleteTask(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).send('Access Denied');
            }

            await Task.findByIdAndDelete(req.params.id);

            return res.redirect('/admin/viewTasks');

        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting task');
        }
    },
    async viewRequests(req, res) {
        const tasks = await Task.find({
            status: "pending approval"
        })
            .populate("assignedTo")
            .populate("createdBy");

        res.render("pages/admin/taskRequests", {
            tasks,
            user: req.user
        });
    },

   async approveTask(req, res) {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send('Access Denied');
        }

        await Task.findByIdAndUpdate(req.params.id, {
            status: 'completed'
        });

        return res.redirect('/admin/viewTasks');

    } catch (error) {
        console.log(error);
        res.status(500).send('Error approving task');
    }
}
};

export default adminController;