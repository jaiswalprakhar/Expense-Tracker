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