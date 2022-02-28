import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import "./App.css"
import Protected from './protected';
import Home from './home';
import Login  from "./user/login"
import Register from "./user/register";
import profile from "./user/profile";
import logout from "./logout";
import edituser from "./user/edituser";
import Sidebar from "./admin/sidebar";
import Dashboard from "./user/dashboard";
import ManageUser from "./admin/manageUsers";
import Admin from "./admin/adminlogin";
import ManageProduct from "./admin/manageProduct";
import Addproduct from "./admin/addproduct"
import Editproduct from "./admin/editproduct"
import Product from "./product"
import Cart from "./cart"
import Payment from "./payment"
import UserVerify from "./user/userverify"
import WishList from "./wishlist";
import Forgot from "./user/forgot";
import SetPassword from "./user/setpassword";
import Myorder from './user/myorder';
import ManageOrder from "./admin/manageorder"


function App() {
  return (
    <Router>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/myorder" exact component={Myorder}/>
          <Route path="/set/password" exact component={SetPassword}/>
          <Route path="/forgot/password" exact component={Forgot}/>
          <Route path="/userverify" exact component={UserVerify}/>
          <Route path="/product" exact component={Product}/>
          <Route path="/wishlist" exact component={WishList}/>
          <Route path="/cart" exact component={Cart}/>
          <Route path="/Sidebar" exact component={Sidebar}/>
          <Route path="/adminlogin" exact component={Admin}/>
          <Route path="/Login-user" exact component={Login}/> 
          <Route path="/logout" exact component={logout}/> 
          <Route path="/Register-user" exact component={Register}/> 
          <Route path="/addproduct" exact component={Addproduct}/> 
          <Route path="/editproduct/:id" exact component={Editproduct}/> 

          <Route path="/dashboard">
               <Protected Cmp={Dashboard}/>
          </Route>

          <Route path="/edituser/:id">
               <Protected Cmp={edituser}/>
          </Route>
          <Route path="/manageuser">
               <Protected Cmp={ManageUser}/>
          </Route>
          <Route path="/manageorder">
               <Protected Cmp={ManageOrder}/>
          </Route>
          <Route path="/profile">
               <Protected Cmp={profile}/>
          </Route>

          <Route path="/manageproduct">
               <Protected Cmp={ManageProduct}/>
          </Route>

          <Route path="/payment/:mode">
               <Protected Cmp={Payment}/>
          </Route>




          {/* <Route path="/edituser/:id" exact component={edituser}/> 
          <Route path="/profile" exact component={profile}/>  */}
          
        </Switch>
    </Router>
  );
}

export default App;
