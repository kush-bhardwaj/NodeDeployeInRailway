require('dotenv').config();
const RazorpayInstance = require('../config/RazorpayConfig');
const CartModel = require('../model/CartModel');
const { ObjectId } = require('mongodb')
const crypto = require('crypto');
const OrderModel = require('../model/OrderModel');
exports.createOrder = async (req, res, next) => {
    const userId = req.user_id
    console.log(userId)
    // const { productId, price } = req.body;

    //find user cart detils by userId
    const FindDetails = await CartModel.aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
            $lookup: {
                from: 'products',
                localField: "productId",
                foreignField: "_id",
                as: "cartsData"
            },

        },
        {
            $unwind: "$cartsData"
        },
    ])

    //  console.log("data2", FindDetails);
    //  console.log("user_id2", userId);
    const totalPrice =FindDetails.reduce((accumulator, item) => {
        return accumulator + item.cartsData.productPrice;
      }, 0);
    // console.log("total2",totalPrice)

    
    const OrderObject = {
        amount: totalPrice * 100,
        currency: "INR",
        receipt:'receipt_1'
    }

    // console.log(OrderObject)
    RazorpayInstance().orders.create(OrderObject, function (err, order) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'something went wrong'
            })
        } 
        console.log(order)
        return res.status(200).json(order)
    })
}

exports.paymentVerify = async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const secret_key = process.env.RAZORPAY_SECRET_KEY;
    const hmac = crypto.createHmac('sha256', secret_key);

    hmac.update(order_id + "|" + payment_id);

    const genretedSignature = hmac.digest('hex');
    if (genretedSignature === signature) {
        return res.status(200).json({
            success: true,
            message: "payment verfied"
        });
    } else {
        return res.status(500).json({
            success: false,
            message: 'payment not verified'
        })
    }
    
}