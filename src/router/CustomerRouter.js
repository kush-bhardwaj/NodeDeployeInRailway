const express = require('express');
const { signup, login, verifyCustomer, forgetPassword, NewPassword, addAddress, updateCustomer, CustomerSingle } = require('../controlls/CustomerAccControler');
const { ForgetMiddleWare } = require('../middleware/ForgetMiddleWare');
const CustumerRouter = express.Router();
CustumerRouter.post('/signup',signup);
CustumerRouter.post('/login',login);
CustumerRouter.get('/verify/:id',verifyCustomer);
CustumerRouter.put('/forget',forgetPassword);
CustumerRouter.put('/newpassword',[ForgetMiddleWare],NewPassword)
CustumerRouter.post('/address',addAddress)
CustumerRouter.put('/update',updateCustomer)
CustumerRouter.get('/single',CustomerSingle)
module.exports = CustumerRouter;