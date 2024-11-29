require('dotenv').config()
const jsonToken = require('jsonwebtoken')
const AdminAccModel = require('../model/AddminAccountModel')
const { genPassword, commparePassowrd } = require('../utils/EncrypPassword')
exports.signup = async function (req, res, next) {
    try {
        const signupData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password:genPassword(req.body.password),
        }
        const resData = await AdminAccModel.create(signupData)
        if (resData) {
            res.json({
                status: "success",
                message: "admin signup success please check your mail for confirm",
                data: resData
            })
        }
        else {
            res.json({
                status: "failed",
                message: "unable to signup success"
            })
        }
    } catch (err) {
        res.json({
            status: "failed",
            message: "someting went wrong || Email is already register",
            error: err

        })
    }
}

exports.login = async function (req, res, next) {
    try {
        const loginData = req.body;
        const query = {email:loginData.email}
        
        
        const resData = await AdminAccModel.findOne(query)

       
        const SecretKey = process.env.SECRET_KEY;
       

        if (resData) {
            if (commparePassowrd(loginData.password ,resData.password )) {
               
                const payload ={
                    name:resData.name,
                    email:resData.email,
                    userId:resData._id
                }
                const userToken = await jsonToken.sign(payload,SecretKey,{expiresIn:"15d"})
                
                res.json({
                    status: "success",
                    message: "login successfull",
                   token:userToken
                })
            } else {
                res.json({
                    status: "failed",
                    message: 'unable to login'
                })
            }
        }

    } catch (err) {
        res.json({
            status: "failed",
            message: "something went wrong to login yout account please  check carefully... good day ||",
            error:err
        })
    }
}
