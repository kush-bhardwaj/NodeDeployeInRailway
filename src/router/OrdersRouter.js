const OrderRouter = require('express').Router();
const { PlaceOrder, GetOrderDetails } = require('../controlls/OrderController');
const { AuthMiddleWare } = require('../middleware/AuthMiddleware');
const { customerMiddleWare } = require('../middleware/CustomerMiddleware');
// OrderRouter.use()
OrderRouter.post('/addorder',customerMiddleWare,PlaceOrder)
OrderRouter.get('/getorder',AuthMiddleWare,GetOrderDetails)
module.exports = OrderRouter;
