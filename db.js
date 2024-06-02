const util=require('util')
const mysql=require('mysql2')


// const pool=mysql.createPool({host:'localhost',user:'root',password:'John@mdu05',database:'neenika'})
const pool=mysql.createPool({host:'monorail.proxy.rlwy.net',user:'root',password:'IKxRJtirtUcLUAwWFHtbvjNvIsvLqrPD',database:'neenika',port:14042})

pool.query=util.promisify(pool.query)


module.exports=pool