const express=require('express');
const route=require('./route');
const cors=require('cors')

const app=express();
app.use(express.json());
app.use(cors())

app.use('/api',route);


app.listen(2020,()=>{
    console.log('server is running on port 2020')
})





