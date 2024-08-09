const { verifyAccessToken } = require('../util/jwtUtil');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        //console.log(token);
        const user = verifyAccessToken(token);
        //console.log(user);
        User.findByPk(user.userId)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err);   
        })
    }
    catch(err) {
        console.log(err);
        if(err.message === "jwt must be provided")
        {
            err.message = "User Not Authorised";
        }
        return res.status(401).json({ 
            err: err.message,
            redirect: 'http://localhost:5500/FRONTEND/components/Layout/login.html'
        })
    }
}

module.exports = { authenticate };