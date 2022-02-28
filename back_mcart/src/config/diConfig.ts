import "reflect-metadata";
import { Container } from "inversify";
import { ExpressServer } from "../expressServer";
import Identifiers from "./identifiers";
import { RouteManager } from "../routeManager";
import { ConfigParams } from "./configParams";
import { DbManager } from "../db/dbManager";


import {UserController } from "../controller/UserController";
import {AdminController } from "../controller/AdminController";
import{ProductController} from "../controller/ProductController";
import{OrderController} from "../controller/OrderController";
import{EmailController} from "../controller/EmailController";


import { IParentService } from "../service/iparentService";
import { ParentDbManager } from "../db/ParentDbManager";
import { ParentService } from "../service/parentService";



let diContainer = new Container({ defaultScope: "Singleton" });
diContainer.bind<ExpressServer>(Identifiers.ExpressServer).to(ExpressServer);
diContainer.bind<RouteManager>(Identifiers.RouteManager).to(RouteManager);
diContainer.bind<ConfigParams>(Identifiers.ConfigParams).to(ConfigParams);





//DB manager
diContainer.bind<DbManager>(Identifiers.DbManager).to(DbManager);
diContainer
  .bind<EmailController>(Identifiers.EmailController)
  .to(EmailController);

diContainer
  .bind<UserController>(Identifiers.UserController)
  .to(UserController);

diContainer
  .bind<AdminController>(Identifiers.AdminController)
  .to(AdminController);

diContainer
  .bind<ProductController>(Identifiers.ProductController)
  .to(ProductController);

  diContainer
  .bind<OrderController>(Identifiers.OrderController)
  .to(OrderController);






  diContainer
  .bind<IParentService>(Identifiers.IParentService)
  .to(ParentService);
diContainer.bind<ParentDbManager>(Identifiers.ParentDbManager).to(ParentDbManager);
// school




export default diContainer;
