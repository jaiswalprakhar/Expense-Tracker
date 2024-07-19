const User = require('../models/user');

exports.createUser = async (req, res) => {
    try {
        const { fullName, emailId, password } = req.body;
        const createUserData = await User.create({
            fullName: fullName,
            emailId: emailId,
            password: password
        })
        res.status(201).json({
            message: `Your account is successfully created. Go to login page.`,
            createdUserData: createUserData
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { emailId, password } = req.body;
        const loginUserData = await User.findOne({where: { emailId: emailId }});
        //console.log(loginUserData.emailId, loginUserData.password);
        if(loginUserData)   {
            if(password === loginUserData.password)  {
                message = `Login Successful`;
                console.log(message);
                res.status(200).json({
                    message: message,
                    loginUserData: loginUserData
                });
            }
            else  {
                message = `Incorrect Password`;
                console.log(message);
                res.status(401).json({
                message: message
                });
            }
        }
        else  {
            message = `Email ID does not exist`;
            console.log(message);
            res.status(404).json({
            message: message
            });
            /*err = `Email ID does not exist`;
            console.log(err);
            throw new Error(err);*/
        }
    }
    catch(err) {
        console.log(err);
        //res.status(500).json({err: err}); 
        next(err);
    }
};

