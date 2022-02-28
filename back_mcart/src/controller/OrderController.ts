import { injectable, inject } from "inversify";
import { Request, Response, Router } from "express";
import { CommonUtils } from '../util/commonUtils';
import Identifiers from "../config/identifiers";
import { ErrorResponse } from "../dto/errorResponse";
import { IParentService } from "src/service/iparentService";
//import { EncryptionUtil } from "../util/encryptionUtil";


@injectable()
export class OrderController {
  public router: Router;

  @inject(Identifiers.IParentService)
  private ParentService: IParentService;

  constructor() 
  {
    this.router = Router();
    this.router.post("/addorder", this.addorder);
    this.router.post("/addwishlist", this.addwishlist);
    this.router.post("/status/:id", this.update_ord);
    this.router.get("/getorder/:id", this.getorder);
    this.router.get("/manageorder", this.manageorder);

  }
  public update_ord= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );

    let id = req.params.id;
    let set =`status='${req.body.status}'`;

    let where = " oid=" + id ;

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        " orders",
        set,
        where
      );
      console.log(id);
      if (id && id.rowCount > 0) {
        res
          .status(200)
          .json({ status: "1", message: "Record Updated Successfully" });
      } else {
        res.status(200).json({ status: "0", message: "Record Update Failed" });
      }
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };


  public manageorder = async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
  
    // let field = ' *';
    // let where = " where is_deleted='0'";
    let field = ' o.*,p.pname,p.price,u.fname';
    let where = ` Join user_tbl u on o.uid=u.uid Join product p on o.list=p.pid`;
  
  
     let result1 = await this.ParentService.findcount(
         " count(*) AS search_count ",
          " orders o ",
          where
        );
        if (result1.rowCount > 0) {
          var count =result1.rows[0].search_count;
          console.log("Count"+result1.rows[0].search_count)
        // res.json({ status: "1", data: count });
        }
  
      const page=req.query.page;
      const per_page=req.query.perpage;
      const total= count;
     
      const cal = total/per_page;
      const total_result=Math.ceil(cal);
      const startindex=(page-1)*per_page; 
      
  
  
    try {
      let result = await this.ParentService.findfieldpagi(
        field,
        " orders o ",
        where,
        per_page,
        startindex
      );
      if (result.rowCount > 0) {
        var top = result.rows;
        var perpagecnt=result.rowCount;
        console.log("Data",result.rowCount)
       res.json({ status: "1",page:page,per_page:per_page ,total:total,perpagecnt:perpagecnt,total_pages:total_result, data:top });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  }
  public getorder = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    let id = req.params.id;
    let field = ' o.*,o.created_at as pdate,p.*,u.uid';
    let where = ` Join user_tbl u on o.uid=u.uid Join product p on o.list=p.pid where o.uid=${id}`;
      
    try {
      let result = await this.ParentService.findfield(field,"orders o",where);
      
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };


  
  public addwishlist = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    //let fulldate = CommonUtils.postgressDateFormat();
    let where = " where uid='" + req.body.uid + "' and pid='" + req.body.pid + "' ";
    let resfinal = await this.ParentService.findfield(' *',"wishlist", where);
    if (resfinal.rowCount > 0) {
      console.log(resfinal.rowCount)
      res.json({ status: "0", message: "Product is already added." });
    } 
    else 
    { 
    var col="uid,pid";

    var val=`'${req.body.uid}','${req.body.pid}'`;
    
    try {
        let result = await this.ParentService.Insert_data(
            "wishlist",
            col,
            val,
            'wid'
        );
            
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top  });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  } 
  };

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



  
  
  // private sendmail = async (tomail:string,subject:string,textmail:string) => 
  //   {      
  //       //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
  //       // using Twilio SendGrid's v3 Node.js Library
  //       // https://github.com/sendgrid/sendgrid-nodejs  Kw4t7XCcRCu_lvNeIfHfug
  //       //mcart
  //       //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
  //       const sgMail = require('@sendgrid/mail');
  //       sgMail.setApiKey('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');
  //       const msg = {
  //       to: tomail,
  //       from: 'mcartapp@gmail.com',
  //       subject: subject,
  //       html: textmail,
  //       };
  
  //      const mailres= sgMail
  //             .send(msg)
  //             .then(() => {
  //               console.log('Email sent')
  //             })
  //             .catch((error) => {
  //               console.error(error)
  //             })
  //      // const mailres=sgMail.send(msg);
  
  //       return mailres;
  //   }
  


}