const { createOrder, paymentVerify } = require('../controlls/RazorpayController');
const { customerMiddleWare } = require('../middleware/CustomerMiddleware');

const PaymentRouter = require('express').Router()
// PaymentRouter.use(customerMiddleWare)
PaymentRouter.post('/createorder',[customerMiddleWare],createOrder);
PaymentRouter.post('/paymentverify',paymentVerify);

module.exports = PaymentRouter