const db = require("./db");
const dayjs = require("dayjs");
const getStack = async (req, res) => {
  await db.query("select * from stack", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};

const getOilStack = async (req, res) => {
  await db.query("select * from stack_madurai", (err, result) => {
    if (err) throw err;
    db.query("select * from stack_karisal", (err, result1) => {
      if (err) throw err;
      result.push(...result1);
      console.log("gfgfiefgwerfbiebfhbfvhf", result);

      res.send(result);
    });
  });
};

const setProductUpdate = async (req, res) => {
  const { oilAndCake, shop } = req.body;
  console.log(oilAndCake, shop);

  if (oilAndCake) {
    try {
      for (const product of oilAndCake) {
        const { quantity, oil_name, selectedType } = product;
        const sql_query = `
                    UPDATE stack_madurai 
                    SET oil_quantity = oil_quantity + ? 
                    WHERE oil_type = ? 
                    AND type = ?
                `;
        await db.query(sql_query, [quantity, oil_name + 1, selectedType + 1]);
      }
      console.log("updated", shop);
      res.send("Update successful");
    } catch (error) {
      console.error("Error updating stack madurai:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(400).send("No data provided for update");
  }
};

const getProductionStack = async (req, res) => {
  await db.query("select * from production_stack", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};

const setProductionRawStack = async (req, res) => {
  const { rawData } = req.body;

  let sql_query = `insert into production_addition (oil_type,value,date) values(${
    rawData.type
  },${rawData.value},'${dayjs(rawData.date).format("YYYY-MM-DD hh:mm:ss")}')`;
  await db.query(sql_query, (err, result) => {
    if (err) throw err;
    res.status(200).send(result);
  });
};

const doGrind = async (req, res) => {
  const { grindData } = req.body;
  let sql_query = `insert into production_grinding (oil_type,used,grinded,produced_oil,produced_cake,date) values(${
    grindData.oilType
  },${grindData.used},${grindData.grind},${grindData.producedOil},${
    grindData.producedCake
  },'${dayjs(grindData.date).format("YYYY-MM-DD hh:mm:ss")}')`;
  await db.query(sql_query, (err, result) => {
    if (err) throw err;
    res.status(200).send(result);
  });
};

const getLog = async (req, res) => {
  const { startDate, endDate } = req.params;
  console.log(startDate, endDate);
  let sql_query = `select * from production_addition where date between '${dayjs(
    endDate
  ).format("YYYY-MM-DD hh:mm:ss")}' AND '${dayjs(startDate).format(
    "YYYY-MM-DD hh:mm:ss"
  )}'`;
  await db.query(sql_query, async (err, result) => {
    if (err) throw err;
    let query = `select * from production_grinding where date between '${dayjs(
      endDate
    ).format("YYYY-MM-DD hh:mm:ss")}' AND '${dayjs(startDate).format(
      "YYYY-MM-DD hh:mm:ss"
    )}'`;
    await db.query(query, (err, result1) => {
      if (err) throw err;
      console.log(result,result1)
      res.status(200).send(result.concat(result1));
    });
  });
};

const undo=async(req,res)=>{

    const{id,type}=req.body
    let tableName=type==1?"production_addition":"production_grinding"
    let sql_query=`delete from ${tableName} where id=${id}`
    await db.query(sql_query,(err,result)=>{
        if(err) throw err
        res.send(result)
    })

}

exports.undo=undo
exports.getStack = getStack;
exports.getOilStack = getOilStack;
exports.setProductUpdate = setProductUpdate;
exports.getProductionStack = getProductionStack;
exports.setProductionRawStack = setProductionRawStack;
exports.doGrind = doGrind;
exports.getLog = getLog;
