const db = require("./db");
const bcrypt = require("bcrypt");

const setUsernamePassword = async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      // Handle error
      console.error(err);
      res.status(500).send("Error hashing password");
      return;
    }
    let sql_query = `update credi set username='${username}',password='${hash}'`;
    await db.query(sql_query, (err, result) => {
      if (err) {
        // Handle error
        console.error(err);
        res.status(500).send("Database error");
        return;
      }
      res.send(result);
    });
  });
};


const doLogin=async(req,res)=>{
    const{username,password}=req.body
    await db.query("select * from credi",(err,result)=>{
        if(err)
        {
            res.status(500).send("crediential error")
            return
        }
        // console.log(result)
        bcrypt.compare(password,result[0].password,(err,result1)=>{
            if(err) console.log(err);
            else if(result1)
            {
                console.log(result1,"matched")
                res.status(200).send("ok")
            }
            else
            {
                res.status(600).send("not ok")
                console.log("not matched")


            }
        })

    })
}

exports.doLogin=doLogin
exports.setUsernamePassword = setUsernamePassword;
