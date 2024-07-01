const db=require('./db')


const addProducts=async (req,res)=>{
    const{pname,price}=req.body;
    let sql_query='insert into ext_products(pname,price) values (?,?)'
    await db.query(sql_query,[pname,price],(err,result)=>{
        if(err)
            throw err;
        res.status(200).send();
    })
}


exports.addProducts=addProducts;