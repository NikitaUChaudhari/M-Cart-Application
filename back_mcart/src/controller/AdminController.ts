import { injectable, inject } from "inversify";
import { Request, Response, Router } from "express";
//import { CommonUtils } from '../util/commonUtils';
import Identifiers from "../config/identifiers";
import { ErrorResponse } from "../dto/errorResponse";
import { IParentService } from "src/service/iparentService";
//import { EncryptionUtil } from "../util/encryptionUtil";


@injectable()
export class AdminController {
  public router: Router;

  @inject(Identifiers.IParentService)
  private ParentService: IParentService;

  constructor() 
  {
    this.router = Router();
    this.router.post("/deleteuser/:id", this.deleteuser);
    this.router.get("/viewallusers", this.ViewAllUser);
    this.router.get("/searchusers", this.SearchUser);
    this.router.post("/loginadmin", this.login_admin);

  }
  public login_admin = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
    let email = req.body.email;
    let password = req.body.password;
    let field = ' *';
    let where = ` where  username='${email}' and password='${password}'`;
      
    try {
      let result = await this.ParentService.findfield(field,"admin",where);
      
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

  public deleteuser= async (req: Request, res: Response) => {
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
    let set =` is_deleted='1'`;

    let where = " uid=" + id + " and is_deleted='0'";

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        "user_tbl",
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


  public SearchUser = async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );

    let field = ' *';
    var q=req.query.find;
    let where = ` where is_deleted='0' and fname LIKE'%${q}%' or lname LIKE'%${q}%' or email LIKE'%${q}%' or CAST(mobile_no AS text) LIKE'%${q}%' `;


     let result1 = await this.ParentService.findcount(
         " count(*) AS search_count ",
          " user_tbl ",
          where
        );
        if (result1.rowCount > 0) {
          var count =result1.rows[0].search_count;
          console.log("Count"+result1.rows[0].search_count)
        // res.json({ status: "1", data: count });
        }

      const page=req.query.pages;
      const per_page=req.query.perpage;
      const total= count;
     
      const cal = total/per_page;
      const total_result=Math.ceil(cal);
      const startindex=(page-1)*per_page; 
      


    try {
      let result = await this.ParentService.findfieldpagi(
        field,
        "user_tbl ",
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
  
 public ViewAllUser = async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );

    let field = ' *';
    let where = " where is_deleted='0'";


     let result1 = await this.ParentService.findcount(
         " count(*) AS search_count ",
          " user_tbl ",
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
        "user_tbl ",
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





}