📌 Employee Management System (EMS) – Node.js

A full-stack Employee Management System built using Node.js, Express, MongoDB, and EJS, with role-based authentication for Admin, Manager, and Employee.

🚀 Features:

🔐 Authentication
Admin signup & login
JWT-based authentication
Role-based access control (Admin, Manager, Employee)


👨‍💼 Admin Features
Create Employees / Managers
View all employees
Edit & delete employees
Assign tasks
View all tasks
Approve tasks

🧑‍💻 Manager Features
View assigned tasks
Edit & delete tasks
Approve tasks

👷 Employee Features
View only assigned tasks
Task status tracking


🛠️ Tech Stack
Backend: Node.js, Express.js
Frontend: EJS, Bootstrap
Database: MongoDB (Mongoose)
Authentication: JWT, bcrypt

📂 Project Structure


Make-API-Of-Project-node.js/
│
├── configs/
│   ├── database.js
│   └── dotenv.js
│
├── controllers/
│   ├── admin.controller.js
│   ├── employee.controller.js
│   └── manager.controller.js
│
├── middlewares/
│   └── userAuth.js
│
├── models/
│   ├── user.model.js
│   └── task.model.js
│
├── routes/
│   ├── admin.routes.js
│   └── employee.routes.js
│
├── views/
│   ├── pages/
│   │   ├── admin/
│   │   └── employee/
│   └── partials/
│
├── public/
├── index.js
└── package.json


⚙️ Installation
1️⃣ Clone the repository
git clone https://github.com/dev-dhamandadiya/Make-API-Of-Project-node.js.git
cd Make-API-Of-Project-node.js
2️⃣ Install dependencies
npm install
3️⃣ Setup environment variables

Create a .env file:

PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=secret


4️⃣ Run the server

npm start

🌐 Routes Overview
🔑 Auth


/admin/signup
/admin/login
/admin/logout


👨‍💼 Admin
/admin/dashboard
/admin/createEmployee
/admin/viewEmployees
/admin/addTask
/admin/viewTasks


📋 Task Actions
/admin/editTask/:id
/admin/deleteTask/:id
/admin/approve/:id


⚠️ Important Notes
Route paths are case-sensitive
👉 Example: /addTask ✅ vs /addtask ❌
Role-based rendering:


Admin → admin views
Employee → employee views
JWT token is stored in cookies
🐞 Known Issues (Fixed)


❌ Admin redirecting to employee dashboard
❌ Route mismatch (addtask vs addTask)
❌ Same view rendering for all roles
❌ Extra EJS closing tags

📸 Future Improvements
Add task deadlines
Add notifications system
Improve UI/UX
Add pagination & filters
REST API version

👨‍💻 Author
Dhamanda Diya Hoshiyarsingh

⭐ Support

If you like this project:

⭐ Star the repo
🍴 Fork it
📢 Share it....