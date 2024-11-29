require('dotenv').config({});
const jsonToken = require('jsonwebtoken');
exports.ForgetMiddleWare = async function (req, res, next) {
    try {
        const Token = req.headers['authorization'].split(" ")[1]
        const Info = jsonToken.verify(Token, process.env.CUSTOMER_PASSWORD_KEY)
        if (Info) {
            req.user_id = Info.customerId
            next()
        } else {
            res.json({
                status: 'failed',
                message: "Unauthrized user"
            })
        }
    } catch (err) {
        res.json({
            status:"failed",
            message:"Unauthorized user detected"
        })
    }
}