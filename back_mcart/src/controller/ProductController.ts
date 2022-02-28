import { injectable, inject } from "inversify";
import { Request, Response, Router } from "express";
import { CommonUtils } from '../util/commonUtils';
import Identifiers from "../config/identifiers";
import { ErrorResponse } from "../dto/errorResponse";
import { IParentService } from "src/service/iparentService";

@injectable()
export class ProductController {
  public router: Router;

  @inject(Identifiers.IParentService)
  private ParentService: IParentService;

  constructor() 
  {
    this.router = Router();
    this.router.post("/addproduct", this.addproduct);
    this.router.post("/addtocart", this.addtocart);
    this.router.post("/deleteproduct/:id", this.deleteproduct);
    this.router.post("/editproduct/:id", this.update_product);


    this.router.get("/viewproduct/:id", this.viewproduct);
    this.router.get("/manageproduct", this.ManageProduct);
    this.router.get("/serachproduct", this.SearchProduct);
    this.router.get("/viewallproduct", this.viewallproduct);
    this.router.get("/viewallwishlist", this.viewallwishlist);
    this.router.get("/search/product", this.search_product);
    this.router.get("/search/category", this.search_category);
    this.router.post("/common/sendemail", this.sendemailforall);

}

public viewallwishlist = async (req: Request, res: Response) => {
     
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS"
  );
  var uid=req.query.uid; 
  let field = ' w.*,p.*';
  let where = `  w join product p on w.pid=p.pid where uid='${uid}' `;
    
  try {
    let result = await this.ParentService.findfield(field,"wishlist",where);
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


public sendemailforall= async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS"
  );
  
 const textmail="<p style='margin-top: 120px; font-size='16px'>Hello Omkar</p> ";
  const email_res=this.sendmail("harshalgangurde6919@gmail.com","req.body.subject",textmail);
 
    
 
    if (email_res) {

      res.json({ status: "1", data: "email send sucess" });
    } else {
      res.json({ status: "0", message: "error" });
    }
    
}


private sendmail = async (tomail:string,subject:string,textmail:string) => 
  {      
      //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
      // using Twilio SendGrid's v3 Node.js Library
      // https://github.com/sendgrid/sendgrid-nodejs  Kw4t7XCcRCu_lvNeIfHfug
      //mcart
      //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
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


public addtocart = async (req: Request, res: Response) => {
     
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS"
  );    


  var col="pname,pdescription";
  var val=`'${req.body.pname}','${req.body.pdesc}'`;
  
  try {
      let result = await this.ParentService.Insert_data(
          "cart",
          col,
          val,
          'cid'
      );
          
    if (result.rowCount > 0) {
      var top = result.rows;
      res.json({ status: "1", data: top ,message: "Product Added Successfully" });
    }else{
      res.json({ status: "0", message: "No data found" });
    }
  } catch (error) {
    res.statusCode = 500;
    res.send(new ErrorResponse(error.name));
  }
};


public search_category = async (req: Request, res: Response) => {
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

  let where 
  if(q==='All'){
    where= ` where is_deleted='0' `;
  }else{
    where= ` where is_deleted='0' and category='${q}' `;
  }
  

  try {
    let result = await this.ParentService.findfield(
      field,
      " product",
      where,
    );
    if (result.rowCount > 0) {
      var top = result.rows;
     res.json({ status: "1", data:top });
    } else {
      res.json({ status: "0", message: "No data found" });
    }
    
  } catch (error) {
    res.statusCode = 500;
    res.send(new ErrorResponse(error.name));
  }
}

public search_product = async (req: Request, res: Response) => {
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
  let where = ` where is_deleted='0' and pname LIKE'%${q}%' `;

  try {
    let result = await this.ParentService.findfield(
      field,
      " product",
      where,
    );
    if (result.rowCount > 0) {
      var top = result.rows;
     res.json({ status: "1", data:top });
    } else {
      res.json({ status: "0", message: "No data found" });
    }
    
  } catch (error) {
    res.statusCode = 500;
    res.send(new ErrorResponse(error.name));
  }
}



public SearchProduct = async (req: Request, res: Response) => {
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
  let where = ` where is_deleted='0' and pname LIKE'%${q}%' or pdescription LIKE'%${q}%' or category LIKE'%${q}%' or CAST(price AS text) LIKE'%${q}%' `;


   let result1 = await this.ParentService.findcount(
       " count(*) AS search_count ",
        " product ",
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
      " product",
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


public ManageProduct = async (req: Request, res: Response) => {
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
        " Product ",
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
      " Product ",
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

 
public addproduct = async (req: Request, res: Response) => {
     
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );    

    var Profile
    var uploadPath
        Profile = req.files.Profile;
    let fulldate = CommonUtils.postgressDateFormat();
    let img=CommonUtils.generateUniqueID()+"-"+Profile.name;
    let path="E:/React Js Project/mcart/public";
        uploadPath = path + '/uploads/products/' +img ;
    
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

    var col="pname,pdescription,price,category,stock,created_at,img,is_deleted";
    var val=`'${req.body.pname}','${req.body.pdesc}','${req.body.price}','${req.body.category}','${req.body.stock}','${fulldate}','${img}','0'`;
    
    try {
        let result = await this.ParentService.Insert_data(
            "product",
            col,
            val,
            'pid'
        );
            
      if (result.rowCount > 0) {
        var top = result.rows;
        res.json({ status: "1", data: top ,message: "Product Added Successfully" });
      }else{
        res.json({ status: "0", message: "No data found" });
      }
    } catch (error) {
      res.statusCode = 500;
      res.send(new ErrorResponse(error.name));
    }
  };

  


  public viewproduct = async (req: Request, res: Response) => {
     
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
    let where = ` where is_deleted='0' and pid=${id}`;
      
    try {
      let result = await this.ParentService.findfield(field,"product",where);
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
  public viewallproduct = async (req: Request, res: Response) => {
     
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
    let where = ` where is_deleted='0'`;
      
    try {
      let result = await this.ParentService.findfield(field,"product",where);
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


  public update_product= async (req: Request, res: Response) => {
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
    let set =`pname='${req.body.pname}',price='${req.body.price}',pdescription='${req.body.pdesc}',stock='${req.body.stock}'`;

    let where = " pid=" + id + " and is_deleted='0'";

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        "product",
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



  public deleteproduct= async (req: Request, res: Response) => {
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

    let where = " pid=" + id + " and is_deleted='0'";

    console.log("set: " + set);

    try {
      let id = await this.ParentService.Update_data(
        "product",
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