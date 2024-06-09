const express=require('express');
const route=require('./route');
const cors=require('cors');
const { prototype } = require('module');

const app=express();
app.use(express.json());
app.use(cors())
app.use('/',express.static('public'));


app.use('/api',route);

const port=process.env.X_ZOHO_CATALYST_LISTEN_PORT;
app.listen(port,()=>{
    console.log('server is running on port ',port)
})





module.exports=app