const express=require('express');
const route=require('./route');
const cors=require('cors');
const path = require('path');

const { prototype } = require('module');

const app=express();
app.use(express.json());
app.use(cors({origin:'*'}))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api',route);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
  });
  

const port=process.env.X_ZOHO_CATALYST_LISTEN_PORT||2020;
app.listen(port,()=>{
    console.log('server is running on port ',port)
})





module.exports=app