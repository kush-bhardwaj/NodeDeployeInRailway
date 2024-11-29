require('dotenv').config()
require('../db/MySql')
const path = require('path');
const MySql = require('../db/MySql')
const jswonwebtoken = require('jsonwebtoken');
const { ObjectId } = require('mongodb')
const CustomerModel = require('../model/CustomerAccountModel');
const { genPassword, commparePassowrd } = require('../utils/EncrypPassword');
const VerifyAccount = require('../utils/Mail')
exports.signup = async (req, res, next) => {
    try {
        const signupData = {
            custumerName: req.body.name,
            custumerEmail: req.body.email,
            custumerPassword: genPassword(req.body.password),
            custumerMobile: req.body.mobile
        }

        const resData = await CustomerModel.create(signupData)
        if (resData) {
            const sentHTML = `<html>
                    <body>
                            <h1 style="color:red;">${resData.custumerName}</h1>
                            <p>Welcome ${resData.custumerName}</p>
                            <span>click on link to verify <a href='http://192.168.0.3:5000/api/auth/customer/verify/${resData._id}'>Verify here<a/></span>
                    </body>
            </html>`
            VerifyAccount(resData.custumerEmail, "Signup Success", " ", sentHTML)
            res.json({
                status: "success",
                message: "signup successfull",
                message: "Check your mail for verify your account"
            })
        } else {
            res.json({
                status: "failed",
                message: "check your email and password"
            })
        }

    }
    catch (err) {
        if (err.custumerName === 'ValidationError') {
            res.json({
                status: "faild",
                message: "name must be greater 4"
            })
        }
        else {
            res.json({
                status: "failed",
                message: "unable to signup",
                error: err
            })
        }
    }
}

exports.login = async (req, res, next) => {
    try {
        const logingInfo = req.body;


        const find = {
            $and: [{ custumerEmail: logingInfo.email.toLowerCase() }, { customer_status: 1 }]
        }

        const resData = await CustomerModel.findOne(find);

        const secretKey = process.env.CUSTOMER_SECRET_KEY;

        if (resData) {
            if (commparePassowrd(logingInfo.password, resData.custumerPassword)) {

                payload = {
                    name: resData.custumerName,
                    email: resData.custumerEmail,
                    customerId: resData._id
                }

                const CustomerToken = await jswonwebtoken.sign(payload, secretKey, { expiresIn: "15d" })

                res.json({
                    status: 'success',
                    message: "login successfull",
                    token: CustomerToken
                })
            }
            else {
                res.json({
                    status: "failed",
                    message: "unable to login"
                })
            }
        }
        else {
            res.json({
                status: "failed",
                message: "Account not verified"
            })
        }
    } catch (err) {
        res.json({
            status: "failed",
            message: "Unable to Loginnn",
            error: err
        })
    }
}

exports.verifyCustomer = async (req, res, next) => {
    try {
        const query = { _id: req.params.id }

        const updateData = await CustomerModel.updateOne(query, { customer_status: 1 });
        if (updateData) {
            res.json({
                name: "success",
                message: 'verify success'
            })
        } else {
            res.json({
                status: "faild",
                message: "unable to failed verify check your details"
            })
        }
    } catch (err) {
        res.json({
            status: "failed",
            message: "something went wrong to verify"
        })
    }
}

//forget password
exports.forgetPassword = async function (req, res, next) {
    try {
        const details = req.body;
        const find = await CustomerModel.findOne({ custumerEmail: details.email })
        const Key = process.env.CUSTOMER_PASSWORD_KEY;

        if (find) {
            payload = {
                custumerEmail: find.custumerEmail,
                customerId: find._id
            }
            const ForgetToken = await jswonwebtoken.sign(payload, Key, { expiresIn: "5m" })
            res.json({
                status: "success",
                data: ForgetToken
            })
        }
    } catch (err) {
        res.json({
            status: "failed",
            message: 'something went wrong'
        })
    }
}

exports.NewPassword = async (req, res, next) => {
    try {
        const query = {
            userId: req.user_id,
            newPassword: await genPassword(req.body.password)
        }


        const find = await CustomerModel.findOne({ _id: query.userId })
        if (find) {
            const change = await CustomerModel.updateOne({ custumerPassword: query.newPassword })
            console.log(change)
            if (change.modifiedCount > 0) {
                res.json({
                    status: "success",
                    message: 'changed password'
                })
            } else {
                res.json({
                    status: "failed",
                    message: "unable to change password"
                })
            }
        }

    } catch (err) {
        res.json({
            status: "failed",
            message: "failed to update"
        })
    }
}


//update CustomerAccount start

exports.updateCustomer = async (req, res, next) => {
    try {
        const customerId = req.query.id;
        const addressData = req.body;

        const query = {$push:{customerAddress:addressData}}

        const resD = await CustomerModel.updateOne({_id:customerId},query)
        if(resD){
            const data = await CustomerModel.findOne({_id:customerId})
            if(data){
                res.json({
                    status:"success",
                    data:data
                })
            }else{
                res.json({
                    status:"failed",
                    message:"failed to find user"
                })
            }
        }else{
            res.json({
                status:"faild",
                messgae:'unable'
            })
        }
    } catch (err) {
        res.json({
            status: 'failed',
            message: 'something went wrong',
            error: err
        })
    }
}
//update CustomerAccount end


//signle
exports.CustomerSingle = async (req, res, next) => {
    try {
        const id = { _id: req.query.id }
        const proj ={custumerPassword: 0,custumerEmail: 0 , _id:0 , customer_status:0, custumerMobile:0 , custumerName:0}
        const find = await CustomerModel.findOne(id, proj)
        if (find) {
            res.json({
                status: 'success',
                data: find
            })
        } else {
            res.json({
                status: 'failed',
                message: "unable to find"
            })
        }
    }
    catch (err) {
        res.json({
            status: "failed",
            message: "somthing went wrong"
        })
    }
}
//single close
/// addresss
exports.addAddress = async (req, res, next) => {
    const data = req.body
    const address = {
        ads1: data.address1,
        ads2: data.address2,
        zip: data.zip,
        pincode: data.pincode,
        state: data.state
    }
    console.log(address)
}
//address end