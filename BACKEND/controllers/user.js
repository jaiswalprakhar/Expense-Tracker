const User = require('../models/user');
const { generatePasswordHash, verifyPassword } = require('../util/pwdUtil');
const { generateAccessToken } = require('../util/jwtUtil');
const UserServices = require('../services/userServices');

exports.createUser = async (req, res, next) => {
    const { fullName, emailId, password } = req.body;
    try {
        if(password.length < 8 || password.length > 15) {
            //throw new Error('Password should be 8 to 10 characters long');
            const error = new Error('Password should be 8 to 15 characters long');
            error.statusCode = 400;
            error.success = false;
            throw error;
        }
        const userPassword = await generatePasswordHash(password);
        
        /*const createUserData = await User.create({
            fullName: fullName,
            emailId: emailId,
            password: userPassword,
            isPremiumUser: false
        })*/
       const userData = {
            fullName: fullName,
            emailId: emailId,
            password: userPassword,
            isPremiumUser: false
        }
        const createUserData = await UserServices.createData(User, userData);
        if(createUserData)  {
            res.status(201).json({
                message: `Your account is successfully created. Go to login page.`,
                createdUserData: createUserData
            });
        }
        /*const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            if(!err) {
                const createUserData = await User.create({
                    fullName: fullName,
                    emailId: emailId,
                    password: hash
                })
                res.status(201).json({
                    message: `Your account is successfully created. Go to login page.`,
                    createdUserData: createUserData
                });
            }
        })*/
    }
    catch(err) {
        //console.log(err.name);
        console.log(err);
        //if(err.errors && err.errors.length > 0) {
            //if(err.errors[0].type === 'Validation error') {
            if(err.name === 'SequelizeValidationError' || 'SequelizeUniqueConstraintError') {
                err.statusCode = 400;
                err.success = false;
            }
        //}
        next(err);
        //console.log(err.message)
        /*res.status(500).json({ err: err,
            errMessage: err.message
         });*/
    }
};

exports.loginUser = async (req, res, next) => {
    const { emailId, password } = req.body;
    try {
        //const loginUserData = await User.findOne({ where: { emailId: emailId } });
        const where = { where: { emailId: emailId } };
        const howMany = "One";
        const loginUserData = await UserServices.findData(User, howMany, where);
        //console.log(loginUserData);
        
        if(loginUserData)   {
            const passwordVerified = await verifyPassword(password, loginUserData.password);
            //if(password === loginUserData.password)  {    //Matching when Password Hashing not implemented
            if(passwordVerified)  {
                const token = generateAccessToken(loginUserData.id, loginUserData.fullName, loginUserData.isPremiumUser);
                message = `Login Successful`;
                console.log(message);
                res.status(200).json({
                    message: message,
                    //loginUserData: loginUserData,
                    redirect: `http://localhost:5500/FRONTEND/components/Layout/expenses.html`,
                    token: token
                });
            }
            else  {
                /*message = `Incorrect Password`;
                console.log(message);
                res.status(401).json({
                message: message
                });*/
                const error = new Error('Incorrect Password');
                error.statusCode = 401;
                error.success = false;
                throw error;
            }
        }
        else  {
            /*message = `Email ID does not exist`;
            console.log(message);
            res.status(404).json({
            message: message
            });*/
            const error = new Error('Email ID does not exist');
            error.statusCode = 404;
            error.success = false;
            throw error;
        }
    }
    catch(err) {
        /*console.log(err);
        res.status(500).json({err: err});*/
       console.log(err);
       if(err.errors && err.errors.length > 0) {
            if(err.errors[0].type === 'Validation error') {
            err.statusCode = 400;
            err.success = false;
            }
       }
        next(err);
    }
};