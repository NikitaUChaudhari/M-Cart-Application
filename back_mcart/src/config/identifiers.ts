module Identifiers {
  export const ExpressServer = Symbol("ExpressServer");
  export const RouteManager = Symbol("RouteManager");
  export const ConfigParams = Symbol("ConfigParams");

  //DB Managers
  export const DbManager = Symbol("DbManager");
 
  export const UserController = Symbol("UserController");
  export const AdminController = Symbol("AdminController");
  export const ProductController = Symbol("ProductController");
  export const OrderController = Symbol("OrderController");
  export const EmailController = Symbol("EmailController");



  export const IParentService = Symbol("IParentService");
  export const ParentDbManager = Symbol("ParentDbManager");

  



}

export default Identifiers;
