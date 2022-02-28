import { injectable, inject } from "inversify";
import { Application } from "express";
import Identifiers from "./config/identifiers";
import Constants from "./util/constants";
import { UserController } from "./controller/UserController";
import { AdminController } from "./controller/AdminController";
import { ProductController } from "./controller/ProductController";
import { OrderController } from "./controller/OrderController";
import { EmailController } from "./controller/EmailController";

@injectable()
export class RouteManager { 
   
     @inject(Identifiers.UserController)
    private UserController:UserController;
  
    @inject(Identifiers.AdminController)
    private AdminController:AdminController;
    
    @inject(Identifiers.ProductController)
    private ProductController:ProductController;

    @inject(Identifiers.OrderController)
    private OrderController:OrderController;

    @inject(Identifiers.EmailController)
    private EmailController:EmailController;
  
    public configure = (express: Application) => {       
        
        console.log('router function');
      
        express.use(Constants.BASE_URL, this.UserController.router);
        express.use(Constants.BASE_URL, this.AdminController.router);
        express.use(Constants.BASE_URL, this.ProductController.router);
        express.use(Constants.BASE_URL, this.OrderController.router);
        express.use(Constants.BASE_URL, this.EmailController.router);
        
    }
 
}
