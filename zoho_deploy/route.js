const express=require('express');
const add_user=require('./add-user')
const sales=require('./sales')
const stack=require('./stack')
const notify=require('./notify-bill')
const route=express.Router();
const login=require('./login')

route.post('/addCustomer',add_user.add_user)
route.post('/getCustomer',add_user.get_users)
route.post('/insertSales',sales.insertSales)
route.post('/getSales',sales.getSales)
route.post('/get',sales.get)
route.get('/getStack',stack.getStack)
route.get('/getOilStack',stack.getOilStack)
route.post('/setPurchaseType',sales.setPurchase);
route.post('/sendNotification',notify.send_notification)
route.post('/checkEmail',add_user.checkEmail)
route.post('/updateUser',add_user.updateUser)
route.post('/removeUser',add_user.removeUser)
route.post('/stackUpdate',stack.setStackUpdate)
route.post('/sendBill',notify.sendBill)
route.get('/getProduction',stack.getProductionStack)
route.post('/setProductionRawStack',stack.setProductionRawStack)
route.post('/doGrind',stack.doGrind)
route.get('/getLog/:startDate/:endDate',stack.getLog)
route.post('/undo',stack.undo)
route.post('/setPassword',login.setUsernamePassword)
route.post('/doLogin',login.doLogin)

module.exports=route;