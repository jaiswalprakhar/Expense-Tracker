const Razorpay = require('razorpay');
const Order = require('../models/order');
const { generateAccessToken } = require('../util/jwtUtil');

exports.purchasePremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZOR_KEY_SECRET
        })

        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            })
            .catch(err => {
                throw new Error(err)
            })
        })
    } catch(err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', err: err });
    }
}

exports.updateTransactionStatus = async (req, res) => {
    /*try {
        const { payment_id, order_id, status } = req.body;
        //console.log(`payment id = ${payment_id}`);
        if(status === "SUCCESS")
        {
            Order.findOne({ where: { orderid: order_id } })
            .then(order => {
                order.update({ paymentid: payment_id, status: 'SUCCESSFUL' })
                .then(() => {
                    req.user.update({ isPremiumUser: true })
                    .then(() => {
                        return res.status(202).json({success: true, message: "Transaction Successful"});
                    }).catch((err) => {
                        throw new Error(err);
                    })
                }).catch((err) => {
                    throw new Error(err);
                })
            }).catch((err) => {
                throw new Error(err);
            })
        }
        else if(status === "FAILED") {
            Order.findOne({ where: { orderid: order_id } })
            .then(order => {
                order.update({ paymentid: payment_id, status: 'FAILED' })
                .then(() => {
                    return res.status(403).json({success: false, message: "Transaction Failed"});
                }).catch((err) => {
                    throw new Error(err);
                })
            }).catch((err) => {
                throw new Error(err);
            })
        }
    } catch(err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', err: err });
    }*/

    try {
        const { payment_id, order_id, status } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });
        if(!order)  {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if(status === "SUCCESS")
        {
            /*await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
            await req.user.update({ isPremiumUser: true });*/
            const updateOrderPromise = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
            const updateUserPromise = req.user.update({ isPremiumUser: true });
            /*await Promise.all([updateOrderPromise, updateUserPromise]);
            return res.status(202).json({ success: true, message: "Transaction Successful" });*/
            console.log(`req.user.isPremiumUser = ${req.user.isPremiumUser}`)
            Promise.all([updateOrderPromise, updateUserPromise])
            .then(() => {
                return res.status(202).json({ success: true, message: "Transaction Successful", token: generateAccessToken(req.user.id, req.user.fullName, req.user.isPremiumUser) });
            })
            .catch((err) => {
                throw new Error(err);
            })
        }
        else if(status === "FAILED")
        {
            await order.update({ paymentid: payment_id, status: 'FAILED' });
            return res.status(403).json({success: false, message: "Transaction Failed"});
        }
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', err: err });
    }
}