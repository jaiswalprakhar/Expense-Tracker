const User = require('../models/user');
const { generatePasswordHash, verifyPassword } = require('../util/pwdUtil');
const { generateAccessToken } = require('../util/jwtUtil');

exports.createUser = async (req, res) => {
    const { fullName, emailId, password } = req.body;
    try {
        if(password.length < 8 || password.length > 15) {
            throw new Error('Password should be 8 to 10 characters long');
        }
        const userPassword = await generatePasswordHash(password);
        const createUserData = await User.create({
            fullName: fullName,
            emailId: emailId,
            password: userPassword,
            isPremiumUser: false
        })
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
        console.log(err);
        //console.log(err.message)
        res.status(500).json({ err: err,
            errMessage: err.message
         });
    }
};

exports.loginUser = async (req, res, next) => {
    const { emailId, password } = req.body;
    try {
        const loginUserData = await User.findOne({ where: { emailId: emailId } });
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
        res.status(500).json({err: err}); 
       // next(err);
    }
};