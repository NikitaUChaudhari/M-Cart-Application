import { injectable, inject } from "inversify";
import { Request, Response, Router } from "express";
import { CommonUtils } from '../util/commonUtils';
import Identifiers from "../config/identifiers";
import { ErrorResponse } from "../dto/errorResponse";
import { IParentService } from "src/service/iparentService";
//import { EncryptionUtil } from "../util/encryptionUtil";


@injectable()
export class UserController {
  public router: Router;

  @inject(Identifiers.IParentService)
  private ParentService: IParentService;

  constructor() 
  {
    this.router = Router();
    this.router.post("/adduser", this.adduser);
    this.router.get("/viewuser/:id", this.view_user);
    this.router.post("/loginuser", this.login_user);
    this.router.post("/edituser/:id", this.update_user);
    this.router.post("/forgot/password", this.setpassword);




  }

  public setpassword= async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );

    let set =`password='${req.body.password}'`;
    let email=req.body.email;  
    let where = " email="  + `'${email}'` + " and is_deleted='0'";

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        "user_tbl",
        set,
        where
      );
      console.log(id);
      if (id && id.rowCount > 0) {
        res.json({ status: "1", message: "Record Updated Successfully" });
      } else {
        res.json({ status: "0", message: "Record Update Failed" });
      }
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };
  public adduser = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );

    let where = " where email='" + req.body.email + "' and is_deleted='0' ";
    let resfinal = await this.ParentService.findfield(' email',"user_tbl", where);
    
    if (resfinal.rowCount > 0) {
      console.log(resfinal.rowCount)
      res.json({ status: "0", message: "Email address is already exist. Please try new one!" });
    } 
    else 
    {    

    var Profile
    var uploadPath
    Profile = req.files.Profile;
    let fulldate = CommonUtils.postgressDateFormat();
    let img=CommonUtils.generateUniqueID()+"-"+Profile.name;
    let path="E:/React Js Project/mcart/public";
    uploadPath = path + '/uploads/' +img ;
    
    console.log(Profile.name)
        Profile.mv(uploadPath, function(err) {
            if (err){
            // return res.status(500).send(err);
            console.log("fail")
            }
            else{
            console.log('File uploaded!');
            }
        }); 

    var col="fname,lname,email,mobile_no,password,created_at,profile,is_deleted";
    var val=`'${req.body.fname}','${req.body.lname}','${req.body.email}','${req.body.mobile_no}','${req.body.password}','${fulldate}','${img}','0'`;
    
    try {
        let result = await this.ParentService.Insert_data(
            "user_tbl",
            col,
            val,
            'uid'
            );
            
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top ,message: "User Registration Successfull" });
      } else {
        res.json({ status: "0", message: "No data found" });
      }
      
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
}
  };

  public login_user = async (req: Request, res: Response) => {
     
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
    let where = ` where is_deleted='0' and email='${email}' and password='${password}'`;
      
    try {
      let result = await this.ParentService.findfield(field,"user_tbl",where);
      
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



  public view_user = async (req: Request, res: Response) => {
     
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
    let field = ' *';
    let where = ` where is_deleted='0' and uid=${id}`;
      
    try {
      let result = await this.ParentService.findfield(field,"user_tbl",where);
      
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


  public update_user= async (req: Request, res: Response) => {
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
    let set =`fname='${req.body.fname}',lname='${req.body.lname}',email='${req.body.email}',Mobile_no='${req.body.mobile_no}'`;

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



}