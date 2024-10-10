const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');
const { generatePasswordHash } = require('../util/pwdUtil');
const sequelize = require('../util/database');

//const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const brevoEmail = require('../util/brevoEmail');
const UserServices = require('../services/userServices');

exports.forgotPassword = async (req, res, next) => {
    const emailId = req.body.emailId;
    
    try {
        //const user = await User.findOne({ where: { emailId: emailId } });
        const where = { where: { emailId: emailId } };
        const howMany = "One";
        const user = await UserServices.findData(User, howMany, where);

        if (!user) {
            //return res.status(404).json({ message: 'User not found' });
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        req.user = user;

        const id = uuid.v4();
        //console.log(id)

        // When the name of the Model = forgotPasswordRequests.js
        //const forgotPasswordRequestCreated = await req.user.createForgotPasswordRequest({ id , active: true });
        
        const expiresBy = new Date(Date.now() + 3600000);
        //console.log(expiresBy);

        /*const forgotPasswordRequestCreated = await req.user.createForgotPassword({ 
            id,
            isActive: true,
            expiresBy
        });*/

        const userData = { 
            id,
            isActive: true,
            expiresBy
        }

        const forgotPasswordRequestCreated = await UserServices.createData(req.user, userData, "createForgotPassword");

        if(!forgotPasswordRequestCreated) {
            //return res.status(403).json({ message: 'ForgotPasswordRequest is not created' });
            const error = new Error('Unable to create Reset Link');
            error.statusCode = 403;
            throw error;
        }
        
        const brevoEmailSent = await brevoEmail(emailId, id);
        
        if(brevoEmailSent)  {
            console.log('Reset Password link sent on EmailID');
            res.status(200).json({ 
                message: 'Reset Password link sent on EmailID',
                success: true
             })
        }
    }
    catch(err) {
        console.log(err);
        next(err);
        /*res.status(500).json({ 
            err: err,
            success: false
        });*/
    }
}

exports.updatePassword = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { newPassword } = req.body;
        if(newPassword.length < 8 || newPassword.length > 15) {
            //throw new Error('Password should be 8 to 10 characters long');
            const error = new Error('Password should be 8 to 15 characters long');
            error.statusCode = 400;
            throw error;
        }
        const { uuid } = req.query;
        console.log(uuid);

        const where1 = { where: { id: uuid } };
        const howMany = "One";

        //const forgotPasswordRequest = await ForgotPassword.findOne({ where: { id: uuid } });
        const forgotPasswordRequest = await UserServices.findData(ForgotPassword, howMany, where1);
        if(!forgotPasswordRequest)  {
            const error = new Error('change password link is incorrect');
            error.statusCode = 404;
            throw error;
        }

        const where2 = { where: { id: forgotPasswordRequest.userId } };
        //const user = await User.findOne({ where: { id: forgotPasswordRequest.userId } });
        const user = await UserServices.findData(User, howMany, where2);
        if(!user) {
            const error = new Error('Email ID not found');
            error.statusCode = 404;
            throw error;
        }

        let newPasswordUpdated;
        const userNewPassword = await generatePasswordHash(newPassword);
        if (user && (userNewPassword !== undefined)) {
            user.password = userNewPassword;
            //newPasswordUpdated = await user.save({ transaction: t });
            newPasswordUpdated = await UserServices.saveData(user, { transaction: t });
            console.log('New Password Updated');
        }

        if(newPasswordUpdated)
        {
            forgotPasswordRequest.isActive = false;
            //await forgotPasswordRequest.save({ transaction: t });
            await UserServices.saveData(forgotPasswordRequest, { transaction: t });
            console.log('Reset Link is now inActive');
        }

        await t.commit();

        res.status(200).json({ 
            message: 'Password Updated, now go to login page',
            success: true
         });
    }
    catch (err) {
        console.log(err);
        await t.rollback();
        //res.status(500).json({err: err.message});
        next(err);
    }   
}