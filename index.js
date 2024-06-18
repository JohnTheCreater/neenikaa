const express=require('express');
const route=require('./route');
const cors=require('cors');
const path = require('path');

const { prototype } = require('module');

const app=express();
app.use(express.json());
app.use(cors())
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname+'/public/index.html'));
//   });
  
app.use('/api',route);

const port=process.env.PORT=2020;
app.listen(port,()=>{
    console.log('server is running on port ',port)
})





module.exports=app