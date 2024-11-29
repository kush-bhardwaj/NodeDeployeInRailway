const OrderModel = require('../model/OrderModel');
const CartModel = require('../model/CartModel')
const {ObjectId} = require ('mongodb');
const { default: mongoose } = require('mongoose');
exports.PlaceOrder = async(req, res ,next)=>{
    try{
            // const getInfo = await CustomerModel.find({userId:req.user_id})
        const userDeliveryAddress =req.body
        const strconAddress= `${userDeliveryAddress.name} ${userDeliveryAddress.mobile} ${userDeliveryAddress.address} ${userDeliveryAddress.state}  ${userDeliveryAddress.city} ${userDeliveryAddress.pincode} ` 
            const JoinData = await CartModel.aggregate([
                {$match:{userId:new ObjectId(req.user_id)}},
                {$lookup:{
                    from:'products',
                    localField:'productId',
                    foreignField:"_id",
                    as:"data",
                }},
                {
                    $unwind:"$data"
                }
            ])
            if(JoinData){
    
                if(JoinData.length !==0){
                    const item = [];
                    let totalAmount = 0;
                    for(let x of JoinData)
                        {
                            const obj = {};
                            obj.productId = x.productId;
                            obj.productName =x.data.productTitle
                            obj.qty = x.quantity,
                            obj.unitPrice = x.data.productPrice;
                            totalAmount+=x.data.productPrice*x.quantity 
                            item.push(obj);
                        }
        
                        const details ={
                            userId:new ObjectId(req.user_id),
                            items:item,
                            paymentOption:req.query.medium,
                            totalAmount:totalAmount,
                            deliveryAddress:strconAddress.toUpperCase()
                        }
                        if(details.paymentOption ==='ONLINE'){
                            details.paymentDone =true 
                        }
                    console.log("details",details);

                      const AddOrder = await OrderModel.create(details);
                       if(AddOrder){
                            await CartModel.deleteMany({userId:req.user_id})
                            res.json({
                                status:"sucess",
                                message:"Order Placed",
                                // data:AddOrder
                            })
                       }
                }
               else{
                res.json({
                    status:"success",
                    message:"Empty cart"
                })
               }
                
            }else{
                res.json({
                    status:"failed",
                    message:"fail to load"
                })
            }
       
    }catch(err){
        res.json({
            status:"failed",
            message:"Something went wrong",
            error:err
        })
    }
}
//testing ho rahi 

//get order 
exports.GetOrderDetails = async(req, res)=>{
    const Order = await OrderModel.find({})
    if(Order){
        res.json({
            status:"true",
            data:Order
        })
    }
}