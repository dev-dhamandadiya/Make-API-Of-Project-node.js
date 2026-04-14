import Task from "../models/task.model.js";

const employeeController = {

    dashboard(req, res) {
        res.render('pages/employee/dashboard', {
            user: req.user
        });
    },

    async viewTasks(req, res) {
    try {
        if (!req.user) return res.redirect('/admin/login');

        const userId = req.user.id || req.user._id;

        console.log("USER ID:", userId); // DEBUG

        const tasks = await Task.find({
            assignedTo: userId
        })
        .populate('createdBy')
        .populate('assignedTo');

        console.log("TASKS:", tasks); // DEBUG

        res.render('pages/employee/viewTask', {
            tasks,
            user: req.user
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Error loading tasks");
    }
},

    async startTask(req, res) {
        try {
            if (!req.user) return res.redirect('/admin/login');

            const userId = req.user.id || req.user._id;

            await Task.findOneAndUpdate(
                {
                    _id: req.params.id,
                    assignedTo: userId
                },
                {
                    status: 'in progress'
                }
            );

            return res.redirect('/employee/tasks');

        } catch (error) {
            console.log(error);
        }
    },

    async requestComplete(req, res) {
        try {
            if (!req.user) return res.redirect('/admin/login');

            const userId = req.user.id || req.user._id;

            await Task.findOneAndUpdate(
                {
                    _id: req.params.id,
                    assignedTo: userId
                },
                {
                    status: 'pending approval'
                }
            );

            return res.redirect('/employee/tasks');

        } catch (error) {
            console.log(error);
        }
    },
  async approveTask(req, res) {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).send('Access Denied');
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: 'completed' },
            { new: true }
        );

        return res.redirect('/admin/viewTasks');

    } catch (error) {
        console.log(error);
        res.status(500).send('Error approving task');
    }
}
};

export default employeeController;