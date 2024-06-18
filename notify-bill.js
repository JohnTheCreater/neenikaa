const db = require("./db");
const nodemailer = require("nodemailer");
const dayjs = require("dayjs");
const puppeteer = require("puppeteer");
const path = require('path');
const fs = require('fs');

const send_notification = async (req, res) => {
  const { user_id } = req.body;
  let sql_query = `select product_id,volume_id,quantity,total_price,date from sales where user_id=${user_id} AND isChecked=0`;
  await db.query(sql_query, (err, result) => {
    if (err) throw err;
    console.log(result);
    let products = [];
    db.query("select * from product", (err, result_product) => {
      products = result_product;
      console.log(products);
      let volumes = [];

      db.query("select * from volume", (err, result_volume) => {
        volumes = result_volume;
        result.map((item) => {
          const product = products.find(
            (prod) => prod.product_id == item.product_id
          );
          const volume = volumes.find((vol) => vol.volume_id == item.volume_id);

          if (product) {
            item.product_type = product.product_name;
          } else {
            console.log(`No product found with id ${item.product_id}`);
          }

          if (volume) {
            item.volume_type = volume.volume_type;
          } else {
            console.log(`No volume found with id ${item.volume_id}`);
          }
        });
        let querry = `select email,full_name from users where user_id=${user_id}`;
        db.query(querry, (err, result1) => {
          if (err) throw err;

          const sender = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "neenikafoodpower@gmail.com",
              pass: "trlm dvyk yggg zsio",
            },
          });
          const composeMail = {
            from: "neenikafoodpower@gmail.com",
            to: result1[0].email,
            subject: "your payment is still remains unpaid!",
            html: `<div>
            <div> <h2>Kindly pay the bill!</h2>
                <p>Dear ${
                  result1[0].full_name
                }, please pay the bill for the items below!. skip! if you have  already paid. <p>
            </div>
            <table style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">product type</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">volume</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">quantity</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">price</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">date</th>
                </tr>
              </thead>
              <tbody>
              ${result
                .map((item) => {
                  return `
                    <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                      item.product_type
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                      item.volume_type
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                      item.quantity
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                      item.total_price
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${dayjs(
                      item.date
                    ).format("DD-MM-YYYY")}</td>
                  </tr>`;
                })
                .join("")}
               
           
          
                
              </tbody>
            </table>
            <table bgcolor="red" style="width:100%; margin-top: 10px;">
  <tr>
    <td style="padding: 10px; text-align: center; color: white;">Unpaid</td>
  </tr>
</table>        </div>
          `,
          };
          sender.sendMail(composeMail, (err, info) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.log("mail sended");
            console.log(info.messageId);
          });
        });
      });
    });
  });
};

const sendBill = async (req, res) => {
  const { userId, date } = req.body;
  const products=["sesame","groundnut","coconut"]
  const volumes=["1 ltr","1/2 ltr","200 ml","100 ml"]

  let sql_query = `select * from sales where user_id=${userId} AND date='${dayjs(date).format('YYYY-MM-DD hh:mm:ss')}' AND isChecked=1`;
  await db.query(sql_query, async (err, result) => {
    console.log(result)
    if (err) throw err;
    await db.query(
      `select full_name,email,mobile_no,gst_number,address from users where user_id=${userId}`,
      async(err, user) => {
        if (err) throw err;
        await db.query('select * from price',async(err,priceList)=>{
          if(err) throw err;

        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // await page.setViewport({ width: 1200, height: 800 });

        const absolutePath = path.resolve(__dirname, 'public', 'neenika.html');
        // await page.goto(`file://${absolutePath}`)
        // const user1=user[0]
        // await page.evaluate((user1,result,priceList)=>{
          

        //   document.querySelector('.name-value').textContent=user1.full_name

        // })
        let total=0;
        let totalQuantity=0;
        const logoPath = '/home/john/app/react_app/back-end/logo.png';
        const logoData = fs.readFileSync(logoPath).toString('base64');
const logoSrc = `data:image/png;base64,${logoData}`;
        await page.setContent(`
        <div class="bd">
      <div class="company">
        <img class="logo" src="${logoSrc}"/>
        <div class="head-left">
          <h1>NEENIKAA FOOD POWER</h1>

          <div class="companydetails">
            <pre>
  FSSAI License Number-12421032000316
  GST Number -33AASFN0502G1ZL
  <div class="address">
    Registered Office:<div class="details" >No 30 School Street,
      Kuttakkarai,Kalamanagar,
      Uthiramerur(PO),Kanchipuram(Dt),
      Tamilnadu-603406
      </div>
  </div>
</div>
 
      </pre>
          </div>
        </div>
        <div class="container" style="min-width: 80%">
          <span class="header" style="text-align: center">Tax Invoice</span>
          <div class="tab" style="min-width:100%">
            <div style="margin-bottom: 10px;" class="col">
              <div class="row">
                <span class="bold">Customer Name</span>
                <span class="name-value">${user[0].full_name}</span>
              </div>
              <div class="row">
                <span class="bold">Customer Address</span>
                <span class="address-value">${user[0].address}</span>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between">
              <div class="row">
                <span class="bold">Date</span>
                <span class="date-value">${dayjs(result[0]?.date).format('DD-MM-YYYY')}</span>
              </div>
              <div class="row">
                <span class="bold">Customer Mobile No</span>
                <span class="mobile-number">${user[0].mobile_no}</span>
              </div>
              <div class="row">
                <span class="bold">GST No</span>
                <span class="gst-number">${user[0].gst_number}</span>
              </div>
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price(Rs)</th>
              <th>Quantity(No)</th>
              <th>Subtotal(Rs)</th>
            </tr>
          </thead>
          <tbody>
          ${
            result.map(item=>{
              const productPrice=priceList.find(it=>it.product_id==item.product_id && it.volume_id==item.volume_id).price
              total+=productPrice*item.quantity
              totalQuantity+=item.quantity
              return`<tr>
                <td>${products[item.product_id-1]}
                ${volumes[item.volume_id-1]}</td>
                <td>${productPrice}</td>
                <td>${item.quantity}</td>
                <td>${item.total_price}</td>
              </tr>`
            }).join('')
          }
             
          
          </tbody>
          <tfoot>
            <tr>
            <td class="k"></td>
              <td class="k" >Total</td>
              <td class="total">${totalQuantity}</td>
              <td class="total">${total}</td>
            </tr>
          </tfoot>
        </table>

        <div class="container" style="min-width: 80%;">
          <span class="header" style="text-align: center">GST Details</span class="header">
          <div class="col" style="min-width: 100%;">
            <div class="row">
              <span class="bold">Description</span>
              <p>5% Taxable value</p>
            </div>
            <div class="row">
              <span class="bold">Taxable(Rs)</span>
              <p class="taxable">${(total-((Math.round(((total/105)*5)/2*100)/100).toFixed(2))*2)}</p>
            </div>
            <div class="row">
              <span class="bold">CGST</span>
              <p>${(Math.round(((total/105)*5)/2*100)/100).toFixed(2)}</p>
            </div>
            <div class="row">
              <span class="bold">SGST</span>
              <p>${(Math.round(((total/105)*5)/2*100)/100).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div class="" style="display: flex;justify-content: center;">
        <div class="bank-details">
          <div class="ban">
            <p><span class="bold">Email:</span>neenikaa2020@gmail.com</p>
            <p><span class="bold">Mobile:</span>824899595</p>
            <p><span class="bold">Bank Name:</span>Tamilnadu Mercantile Bank</p>
            <p><span class="bold">Bank A/c No:</span>435531111111</p>
            <p><span class="bold">IFSC:</span> TMBL000435</p>
            <p><span class="bold">Branch:</span>Sivakasi</p>
          </div>

          <div >
            <p>For Neenika Food Power</p>
            <br /><br />
            <p>Authorized Signatory</p>
          </div>
        </div>
      </div>
        </div>
        `)
        await page.addStyleTag({ path: './style.css' });
        await page.pdf({ path: "bill.pdf", format: "A4" });
        await browser.close();
        const sender = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "neenikafoodpower@gmail.com",
            pass: "trlm dvyk yggg zsio",
          },
        });
        let composeMail = {
          from: "neenikafoodpower@gmail.com",
          to: user[0].email,
          subject: `The bill for purchase on ${dayjs(date).format('DD-MM-YYYY')}`,
          attachments: [
            {
              filename: "bill.pdf",
              path: "./bill.pdf",
            },
          ],
        };
        await sender.sendMail(composeMail, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send();
          } else {
            console.log("mail sended");
            res.status(200).send({ message: "mail sended suc" });
          }
        });
      })
      }
    );
  });
};

async function sendMail(salseList, date, name, email) {}
exports.send_notification = send_notification;
exports.sendBill = sendBill;
