require('dotenv');
const jsonToken = require('jsonwebtoken');
exports.customerMiddleWare = async(req, res, next)=>{
    try{
    // 
        const customerToken = req.headers['authorization'].split(" ")[1]
        
        if(!customerToken){
            return res.status(403).json({
                status:'failed',
                message:"token required"
            })
        }
        const customerInfo = jsonToken.verify(customerToken,process.env.CUSTOMER_SECRET_KEY)
        
        if(customerInfo){
            req.user_id = customerInfo.customerId
            next()
        }else{
            res.json({
                status:"failed",
                message:"unauthrized user"
            })
        }
        
    }catch(err){

        res.json({
            status:"failed",
            message:"Unauthorizaed user detect",
            error:err
        })
    }
}


exports.paymentApi = async(req, res, next)=>{
//    next()
}