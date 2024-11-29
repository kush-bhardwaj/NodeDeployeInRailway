require('dotenv').config();
const jwt = require('jsonwebtoken')
const cartModel = require('../model/CartModel');
const { ObjectId } = require('mongodb')
exports.AddCart = async (req, res, next) => {

    try {
        
        const CartDetails = {
            userId: req.user_id,
            productId: req.body.productId,
        }
        const existItem = await cartModel.findOne({userId:CartDetails.userId,productId:CartDetails.productId})
        if(existItem){
             res.json({
                status:"failed",
                message:"prduct already inside"
             })
        }else{
            const resData = await cartModel.create(CartDetails)
            if (resData) {
                res.json({ 
                    status: 'success',
                    message: "Product added"
                })
            } else {
                res.json({
                    status: "failed",
                    message: "unable to add to cart"
                })
            }
        }
       
    } catch (err) {
        res.json({
            status: "failed to add",
            message: "something went wrong",
            error: err
        })
    }
}

exports.CartsAggregate = async function (req, res, next) {
    try {
        const query = { _id: req.user_id }
        
        const resData = await cartModel.aggregate([

            { $match: { userId: new ObjectId(query._id) } },
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
        if (resData) {
            res.json({
                status: 'success',
                data: resData
            })
        }
        else {
            res.json({
                status: "failed",
                message: "unable to aggregate cart"
            })
        }
    } catch (err) {
        res.end(JSON.stringify({
            status: "failed",
            message: 'someting went wrong',
            error: err
        }))
    }
}

//update qunatity cart api here

exports.IncreaseQunatity = async function (req, res, next) {
    try {
        const userid =req.user_id
        
        const productid = req.params.id
        const updateData = { $inc: { quantity: 1 } }
        //find product by productId
        const check = await cartModel.findOne({$and:[{userId:userid},{productId:productid}]})
        if (check) {
            //increase 1 in quantity if product exist
            const resData = await cartModel.updateOne({ _id:check._id}, updateData)
            if (resData) {
                // const get = await 
                res.json({
                    status: "success",
                    message: `One item added`,
                    data:check
                })
            } else {
                res.json({
                    status: "failed",
                    message: "unable to add item"
                })
            }
        } else {
            res.json({
                status: "failed",
                message: "product not found to update"
            })
        }

    } catch (err) {
        res.json({
            status: "failed",
            message: "failed to add Item"
        })
    }
}

//upate quantity cart api end

// decrease qunatity cart api start

exports.DescreaseQunatity = async (req, res, next) => {
    try {
        const userid=req.user_id
        const productid = req.params.id
        const updateData = { $inc: { quantity: -1 } }
        const findCartData = await cartModel.findOne({$and:[{userId:userid},{productId:productid}]})
        if (findCartData) {
            const resData = await cartModel.updateOne({ _id:findCartData._id}, updateData)
            if (resData) {
                res.json({
                    status: "success",
                    message: "remove One item"
                })
            }
            else {
                res.json({
                    status: "failed",
                    message: "unable to add item"
                })
            }
        } else {
            res.json({
                staus: "failed",
                message: "no items in your cart"
            })
        }
    } catch (err) {
        res.json({
            status: "failed",
            message: "something went wrong",
            error:err
        })
    }
}


// decrease qunatity cart api end
//delete cart api

exports.DeleteCart = async function (req, res, next) {
    const userid=req.user_id
    const productid = req.params.id
    const FindProduct = await cartModel.findOne({$and:[{userId:userid},{productId:productid}]})
    if(FindProduct){
        const deleteCart = await cartModel.deleteOne(FindProduct._id)
        if(deleteCart){
            res.json({
                status:"success",
                message:"delete successFully"
            })
        }else{
            res.json({
                status:"failed",
                message:"unable to delete cart"
            })
        }
    }else{
        res.json({
            status:"failed",
            message:"something went wrong to delete"
        })
    }
}

//delete cart api end

