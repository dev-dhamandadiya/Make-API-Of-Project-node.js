import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/admin/login');
        }
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;
        next();
        const isAdmin = (req, res, next) => {
            if (req.user.role !== 'admin') {
                return res.status(403).send("Access Denied");
            }
            next();
        };
    } catch (error) {
        console.log("Auth Error:", error.message);

        res.clearCookie('token');  
        return res.redirect('/admin/login');  
    }
};

export default userAuth;