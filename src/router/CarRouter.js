const express = require('express');
const { AddCart, CartsAggregate, DeleteCart, IncreaseQunatity, DescreaseQunatity } = require('../controlls/CartController');
const { customerMiddleWare, paymentApi } = require('../middleware/CustomerMiddleware');
const CartRouter = express.Router()
CartRouter.use(customerMiddleWare)
CartRouter.get('/getcart',CartsAggregate)
// CartRouter.post('/addcart',customerMiddleWare,AddCart) // for single middleware
CartRouter.post('/addcart',AddCart)
CartRouter.put('/updatecart/:id',IncreaseQunatity)
CartRouter.put('/decrement/:id',DescreaseQunatity)
CartRouter.put('/remove/:id',DescreaseQunatity)
CartRouter.delete('/deletecart/:id',DeleteCart)
// CartRouter.get('/getcart',paymentApi,CartsAggregate) // for payment api
module.exports = CartRouter;