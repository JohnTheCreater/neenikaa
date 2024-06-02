const dayjs = require("dayjs");
const db = require("./db");

//insert update
const insertSales = async (req, res) => {
  let { list, date, shop } = await req.body;

  date = date.replace(/\//g, "-");
  date = date
    .split("-")
    .map((part) => part.padStart(2, "0"))
    .join("-");

  const dateIST = dayjs(date).format("YYYY-MM-DD hh:mm:ss");
  const values = list

    .map((item) => {
      return `(${item.user_id},${item.product_id},${
        item.volume_id
      },'${dateIST}',${item.quantity},'${
        item.isChecked ? "paid" : "lend"
      }','${shop}',${item.isChecked})`;
    })
    .join(",");
  let sql_query = ``;
  let sql_query_del = `delete from sales where date='${dateIST}' AND shop='${shop}'`;
  await new Promise((resolve, reject) => {
    db.query(sql_query_del, (err, result) => {
      if (err) reject(err);
      if (list.length == 0) {
        res.send("deleted");
      }
      resolve();
    });
  });
  if (list.length != 0) {
    sql_query = `insert into sales(user_id,product_id,volume_id,date,quantity,purchase_type,shop,isChecked) values ${values} `;

    await db.query(sql_query, (err, result) => {
      if (err) throw err;
      res.send("sales added..");
      console.log("sales addesd");
    });
  }
};

//getsales
const getSales = async (req, res) => {
  const { date, shop, startDate, endDate } = await req.body;
  const dateIST = dayjs(date).format("YYYY-MM-DD hh:mm:ss");
  let sql_query = "";
  if (date)
    sql_query = `select * from sales where date='${dateIST}' and shop='${shop}'`;
  else
    sql_query = `select * from sales where shop='${shop}' and date between '${dayjs(endDate).format("YYYY-MM-DD hh:mm:ss")}'
     AND 
     '${dayjs(startDate).format("YYYY-MM-DD hh:mm:ss")}'`;

  let priceList = [];
  await db.query(sql_query, async (err, result) => {
    if (err) throw err;
    let query = `select * from price`;
    await new Promise((resolve, reject) => {
      db.query(query, (err, res) => {
        if (err) reject(err);
        priceList.push(...res);
        resolve();
      });
    });
    result.map((item) => {
      const price_item = priceList.find(
        (price) =>
          price.product_id === item.product_id &&
          price.volume_id === item.volume_id
      ).price;
      // if(item.product_id==priceList[0].product_id )
      if (!item.lend) item.lend = 0;
      if (!item.paid) item.paid = 0;
      if (item.purchase_type == "lend") item.lend = price_item * item.quantity;
      else if (item.purchase_type == "paid")
        item.paid = price_item * item.quantity;
    });
    res.send(result);
  });
};

const get = async (req, res) => {
  console.log("called");
  const { tableName } = req.body;
  let sql_query = `select * from ${tableName}`;
  await db.query(sql_query, (err, result) => {
    if (err) throw err;
    res.send(result);
    console.log(result);
  });
};

const setPurchase = async (req, res) => {
  const { isChecked, saleId } = req.body;
  let sql_query = `update sales set purchase_type='${
    isChecked ? "paid" : "lend"
  }' ,isChecked=${isChecked} where sale_id=${saleId}`;
  await db.query(sql_query, (err, result) => {
    if (err) {
      if ((err.code = "ER_DUP_ENTRY")) {
        const dupValueString = err.sqlMessage.match(
          /Duplicate entry '(.*)' for key/
        )[1];
        const [
          user_id,
          product_id,
          volume_id,
          purchase_type,
          shop,
          date,
        ] = dupValueString
          .match(/(\d+)-(\d+)-(\d+)-(\w+)-(\w+)-([\d- :]+)/)
          .slice(1);
        sql_query = `SELECT sale_id,quantity from sales where user_id=${user_id} AND product_id=${product_id} AND volume_id=${volume_id} AND purchase_type='${purchase_type}' AND date='${date}'`;
        db.query(sql_query, (err, result) => {
          if (err) throw err;
          console.log(result[0].sale_id + " " + result[0].quantity);
          db.query(
            `delete from sales where sale_id=${result[0].sale_id}`,
            (err, result1) => {
              if (err) throw err;
              console.log("up suc");
            }
          );
          let querry = `update sales set quantity=quantity+${
            result[0].quantity
          },purchase_type='${
            isChecked ? "paid" : "lend"
          }' ,isChecked=${isChecked} where sale_id=${saleId}`;
          db.query(querry, (err, resul) => {
            if (err) throw err;
          });
        });
      }
    }
    res.send(result);
  });
};

exports.get = get;
exports.insertSales = insertSales;
exports.getSales = getSales;
exports.setPurchase = setPurchase;
