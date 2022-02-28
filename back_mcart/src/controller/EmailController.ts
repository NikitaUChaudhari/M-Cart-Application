import { injectable, inject } from "inversify";
import { Request, Response, Router } from "express";
import { CommonUtils } from '../util/commonUtils';
import Identifiers from "../config/identifiers";
import { ErrorResponse } from "../dto/errorResponse";
import { IParentService } from "src/service/iparentService";
//import { EncryptionUtil } from "../util/encryptionUtil";


@injectable()
export class EmailController {
  public router: Router;

  @inject(Identifiers.IParentService)
  private ParentService: IParentService;

  constructor() 
  {
    this.router = Router();
    this.router.post("/addorderrr", this.addorder);
    this.router.post("/paymentmail", this.paymentmail);
    this.router.post("/user/reg", this.userreg);
    this.router.post("/forgotpass", this.forgotpass);
  
  }

  public forgotpass= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    var link = "http://localhost:3000/set/password";
    var email=req.body.email;
    var subject="Reset Password";
    
   const textmail=`<p style='margin-top: 120px; font-size='16px'>Hello ${email} Set Your Password
    <br>Click On below link<br>${link} <br>Thanks you<br>M-cart Team
   </p> `;
    const email_res=this.sendmail(email,subject,textmail);
   
      if (email_res) {
        res.json({ status: "1", data: "email send sucessfully" });
      } else {
        res.json({ status: "0", message: "error" });
      }
    }

  public userreg= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    var email=req.body.email;
    var otp=req.body.otp
    var subject="user verification";
    
   const textmail=`<p style='margin-top: 120px; font-size='16px'>Hello ${email} successfully register<br>OTP is ${otp} <br>Thanks you!!<br>mCart Team
   </p> `;
    const email_res=this.sendmail(email,subject,textmail);
   
      if (email_res) {
        res.json({ status: "1", data: "Email send sucessfully." });
      } else {
        res.json({ status: "0", message: "error" });
      }
    }



  public paymentmail= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    var email=req.body.email;
    var subject="Payment Details";
    var name=req.body.fname;
    
   const textmail=`<p style='margin-top: 120px; font-size='16px'>Dear <b><i>${name} <i><b> Your order has been successfully placed.<br>
   You will receive the next update when the item in your order is packed/shipped by the seller.
    <br>Thank you for shopping with mCart!<br><b>mCart Team<br/><b>
    </p> `;
    const email_res=this.sendmail(email,subject,textmail);
   
      if (email_res) {
        res.json({ status: "1", data: "Email send sucessfully" });
      } else {
        res.json({ status: "0", message: "error" });
      }
    }
  
  
  private sendmail = async (tomail:string,subject:string,textmail:string) => 
    {      
        
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey('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');
        const msg = {
        to: tomail,
        from: 'mcartapp@gmail.com',
        subject: subject,
        html: textmail,
        };
  
       const mailres= sgMail
              .send(msg)
              .then(() => {
                console.log('Email sent')
              })
              .catch((error) => {
                console.error(error)
              })
       // const mailres=sgMail.send(msg);
  
        return mailres;
    }
  

    public addorder = async (req: Request, res: Response) => {
     
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, DELETE, OPTIONS"
      );
      let fulldate = CommonUtils.postgressDateFormat();
      var col="uid,street,city,state,zipcode,created_at,status,pay_mode,list";
  
      var val=`'${req.body.uid}','${req.body.street}','${req.body.city}','${req.body.state}','${req.body.zipcode}','${fulldate}','${req.body.status}','${req.body.pmode}','${req.body.list}'`;
      
      try {
          let result = await this.ParentService.Insert_data(
              "orders",
              col,
              val,
              'oid'
          );
              
        if (result.rowCount > 0) {
          var top = result.rows;
          res.json({ status: "1", data: top ,message: "Order Placed Successfully" });
        } else {
          res.json({ status: "0", message: "No data found" });
        }
        
      } catch (error) {
        res.statusCode = 500;
        res.send(new ErrorResponse(error.name));
      }
    };
  
}