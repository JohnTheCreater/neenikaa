const db = require("./db");

const add_user = (req, res) => {
  const users = req.body;

  let values = users
    .map(
      (user) =>
        `('${user.fullname}','${user.gender}','${user.email}','${user.mobileno}','${user.address}','${user.city}','${user.state}','${user.zip}','${user.gst?user.gst:null}')`
    )
    .join(",");
  let sql_query = `INSERT INTO users (full_name,gender,email,mobile_no,address,city,state,zip_code,gst_number) VALUES ${values}`;

  db.query(sql_query, (err, result) => {
    if (err) throw err;
    res.send("user added..");
  });
};

const get_users = (req, res) => {
  const { list } = req.body;
  let values = "";
  if (list?.length>0)
    values = `where user_id in (${list.join(',')})`
  let sql_query = `select * from users ${values}`;
  db.query(sql_query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};

const checkEmail=async (req,res)=>{
  const{email,id}=req.body;
  let sql_query='';
  if(!id)
    sql_query=`select full_name from users where email='${email}'`
  else
    sql_query=`select full_name from users where email='${email}' AND user_id != ${id}`

  await db.query(sql_query,(err,result)=>{
    if(err) throw err;
    console.log(result.length)
    if(result.length==0)
      res.status(200).send({message:"no user found!"})
    else
      res.status(409).send({message:"already have user!"});
  })
}


const updateUser=async (req,res)=>{
  const {id,user}=req.body
  let sql_query=`UPDATE users SET full_name='${user.fullname}',gender='${user.gender}',email='${user.email}',mobile_no='${user.mobileno}',address='${user.address}',city='${user.city}',state='${user.state}',zip_code='${user.zip}',gst_number='${user.gst?user.gst:null}' WHERE user_id=${id}`
  await db.query(sql_query,(err,result)=>{
    if(err) res.status(500).send();
    res.status(200).send();
  })

}


const removeUser=async(req,res)=>{
  const {id}=req.body
  let sql_query=`delete from users where user_id=${id}`
  await db.query(sql_query,(err,result)=>{
    if(err) res.status(500).send()
    console.log("removed")
    res.status(200).send()
  })
}
exports.add_user = add_user;
exports.get_users = get_users;
exports.checkEmail=checkEmail;
exports.updateUser=updateUser;
exports.removeUser=removeUser;
