import './App.css';
import {makePostRequest} from "./util/utils"
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import swal from 'sweetalert'
import Dashboard from './user/dashboard';
import { useDispatch } from "react-redux";
import Radio from '@mui/material/Radio';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { 
	removeFromCart,
	decreaseCart,
	addcart,
	clearCart,
	getTotals
} from './features/cart';
import { useHistory } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
    
const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const Validation_Schema = Yup.object().shape({
        card_name: Yup.string().required('Required'),
        card_no: Yup.string().required('Required'),
        exp: Yup.string().required('Required'),
        cvv: Yup.string() .matches(/^\d+$/, 'This field should have digits only').required('Required'),
        street: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        zipcode: Yup.string() .matches(/^\d+$/, 'This field should have digits only').required('Required'),
      });

      const Validation_Schema1 = Yup.object().shape({
        street: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        zipcode: Yup.string() .matches(/^\d+$/, 'This field should have digits only').required('Required'),
      });

export default function Productcart() {
    const history =useHistory()
    const [card_name,setcard_name]=useState();
    const [card_no,setcard_no]=useState();
    const [exp,setexp]=useState();
    const [cvv,setcvv]=useState();
    const [pidlist,setpidlist]=useState()
    const [street,setstreet]=useState();
    const [city,setcity]=useState();
    const [state,setstate]=useState();
    const [zipcode,setzipcode]=useState();
    const [value, setValue] =useState([]);


    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const [selectedValue, setSelectedValue] = React.useState('COD');
    const [open, setOpen] = React.useState(false);

  
    const handleClose = () => {
      setOpen(false);
    };
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };


	useEffect(() => {
		dispatch(getTotals())
	}, [cart, dispatch])

    function funcRemoveFromCart(cartItem) {
        dispatch(removeFromCart(cartItem))
    }

	function funcDecreaseCartItem(cartItem) {
		dispatch(decreaseCart(cartItem))
	}

	function funcIncreaseCartItem(cartItem){
		dispatch(addcart(cartItem))
	}

	function funcClearCart() {
		dispatch(clearCart())
	}
   
    function confirm(){
        var prod_list=cart.cartItems.map(e => e.pid);
        for (var i=0; i<prod_list.length;i++)
        {
         pay(prod_list[i]);
        }
    }

    function order(){
        if(cart.cartTotalAmount>0){
            setOpen(true);
            localStorage.setItem("totalpay",cart.cartTotalAmount )
        }else{
            swal("Your cart is empty","","warning")
        }
        
    }

    async function pay(pidd){
        let bodyFormData = new FormData();
          bodyFormData.append("list",pidd);
          bodyFormData.append("pmode",selectedValue);
          bodyFormData.append("status","order placed");
          bodyFormData.append("street",street);
          bodyFormData.append("city",city);
          bodyFormData.append("state",state);
          bodyFormData.append("zipcode",zipcode);
          bodyFormData.append("uid",localStorage.getItem("user_id"));
        makePostRequest("/addorder", bodyFormData).then((response) => {
            if (response.data.status === "1") {
                swal("Success",response.data.message, "success")
                .then(function() {
                    setOpen(false)
                    funcClearCart() 
                    sendmail()
                    history.push("/product")
                });
               
                // mailsend();
              }else{  
                swal("Error",response.data.message, "warning"); 
              }
            
          }).catch((err) => {
            swal("There was an error!", "more error detail", "warning");
          });
      }
      
      async function sendmail(){
        var bodyFormData=new FormData()
        bodyFormData.append("email",localStorage.getItem("uemail"));
        bodyFormData.append("fname",localStorage.getItem("uname"));
        makePostRequest("/paymentmail", bodyFormData).then((response) => {
            if (response.data.status === "1") {
                //swal("Success","Please check your mail box", "success");
              }else{  
                swal("Error","Mail Failed", "warning"); 
              }
            
          }).catch((err) => {
            swal("There was an error!", "more error details", "warning");
          });
    }



    var UserInitials 
    if(selectedValue=="COD"){
        UserInitials={
            street: '',
            city: '',
            state: '',
            zipcode: ''
          }
    }else{
    UserInitials={
        card_name: '',
        card_no: '',
        exp: '',
        cvv: '',
        street: '',
        city: '',
        state: '',
        zipcode: ''
      }
    } 
    return (

<div className="cart-items">
<Dashboard/>
<div class="card">

    <div class="row">
        <div class="col-md-8 cart">
            <div class="title">
                <div class="row">
                    <div class="col">
                        <h4><b>Shopping Cart</b></h4>
                    </div>
                    <div class="col align-self-center text-right text-muted">{cart.cartItems.length} items</div>
                </div>
            </div>
            <div class="row main align-items-center">
            <div class="col">
            Image
            </div>
            <div class="col">
            Name
            </div>
            <div class="col">
            Quantity
            </div>
            <div class="col">
            Price
            </div>
            <div class="col">
            Total
            </div>
            </div>
            {(cart.cartItems.length>0)?cart.cartItems.map(cartItem => (
            <div class="row border-top border-bottom">
                <div class="row main align-items-center">
                    <div class="col-2">
                        <img class="img-fluid" src={process.env.PUBLIC_URL + `/uploads/products/${cartItem.img}`} alt="img"/>
                    </div>
                    <div class="col">
                        <div class="row text-muted">{cartItem.category}</div>
                        <div class="row">{cartItem.pname}</div>
                    </div>
                    <div class="col"> 
                        <div>
                            <span className='pointer' onClick={() => funcDecreaseCartItem(cartItem)}>- &nbsp; </span>
                                 <span className="count">{cartItem.cartQuantity}</span>
                            <span  className='pointer' onClick={() => funcIncreaseCartItem(cartItem)}> &nbsp; +</span>
                        </div>
                    </div>
                    <div class="col">
                        ₹{cartItem.price}
                    </div>
                    <div class="col">
                        ₹{cartItem.price * cartItem.cartQuantity}
                        <span  className='pointer' onClick={() => funcRemoveFromCart(cartItem)}>
                             &nbsp;&nbsp;&nbsp;   &#10005;    
                         </span>
                    </div>
                        
                </div>
            </div>
            ))
            :<p className="text-center">No data found</p>
        }
           
 
            <div className="cart-summary">
           {
             (cart.cartItems.length>0)  
             ?<button className="clear-cart btn btn-primary" onClick={() => funcClearCart()}>Clear Cart</button>
             :<button className="clear-cart btn btn-primary" disabled>Clear Cart</button>
           }
                <div className="cart-checkout">
                    <div class="back-to-shop"><span class="text-muted" onClick={()=>history.push("/product")}>Back to shop</span>
                </div>
            </div>

            </div>
        </div> 
        <div class="col-md-4 summary">
            <div>
                <h5><b>Summary</b></h5>
            </div>
            <hr/>
            <div class="row">
                <div class="col" >ITEMS {cart.cartItems.length}</div>
                <div class="col text-right">₹ { cart.cartTotalAmount }</div>
            </div>
           
            <div class="row">
                <div class="col">TOTAL PRICE</div>
                <div class="col text-right"> ₹{ cart.cartTotalAmount }</div>
                
            </div>
            <div class="row">
            <div class="col">Payment Mode </div>
               <div> &nbsp;&nbsp;COD:<Radio
                        checked={selectedValue === 'COD'}
                        onChange={handleChange}
                        value="COD"
                    />  Pay Online:<Radio
                        checked={selectedValue === 'Online'}
                        onChange={handleChange}
                        value="Online"
                    />
            </div>
            </div>
            
             <button class="btn" onClick={()=>order()}>CHECKOUT</button>
        </div>    

</div>
</div>

<Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
          <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Complete Your Order.
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Cancel
            </Button>
          </Toolbar>
        </AppBar>
        <div>
         {
           (selectedValue=="COD")  ? <div class="col-md-8">
           <div class="card p-3">
           <Formik
                       enableReinitialize
                       initialValues={UserInitials}
                       validationSchema={Validation_Schema1}
                       onSubmit={confirm}
                   >
                       {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, }) => (
                       <Form>
               <div class="mt-4 mb-4">
                   <h6 class="text-uppercase">Shipping Address</h6>
                   <div class="row mt-3">
                       <div class="col-md-6">
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control" 
                            value={values.street}
                            onChange={handleChange("street")}
                            onBlur={() => setFieldTouched("street")}
                            onChangeCapture={(e) => (setstreet(e.target.value))}
                           /> 
                           <span>Street Address</span> 
                           {errors.street && touched.street ? <div className="errmsg">{errors.street}</div> : null}
                           </div>
                       </div>
                       <div class="col-md-6">
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control"
                           value={values.city}
                           onChange={handleChange("city")}
                           onBlur={() => setFieldTouched("city")}
                           onChangeCapture={(e) => (setcity(e.target.value))}
                           /> 
                           <span>City</span> 
                           {errors.city && touched.city ? <div className="errmsg">{errors.city}</div> : null}
                           </div>
                       </div>
                   </div>
                   <div class="row mt-2">
                       <div class="col-md-6">
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control" 
                           value={values.state}
                           onChange={handleChange("state")}
                           onBlur={() => setFieldTouched("state")}
                           onChangeCapture={(e) => (setstate(e.target.value))}
                           /> 
                           <span>State/Province</span> 
                           {errors.state && touched.state ? <div className="errmsg">{errors.state}</div> : null}
                           </div>
                       </div>
                       <div class="col-md-6">
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control"
                           value={values.zipcode}
                           onChange={handleChange("zipcode")}
                           onBlur={() => setFieldTouched("zipcode")}
                           onChangeCapture={(e) => (setzipcode(e.target.value))}
                           /> 
                           <span>Zip code</span> 
                           {errors.zipcode && touched.zipcode ? <div className="errmsg">{errors.zipcode}</div> : null}
                           </div>
                       </div>
                   </div>
                   <div class="mt-4 mb-4 d-flex justify-content-between">
                     <Button variant="contained" onClick={()=>history.push("/product")}>Cancel</Button>
                     <Button variant="outlined" disabled={!isValid} onClick={(e) => handleSubmit(e)}>Order Now</Button>
                   </div>
                   
               </div>
               </Form>
           )}
         </Formik>
           </div>
       </div>
           : <div class="col-md-8">
           <div class="card p-3">
           <Formik
                       enableReinitialize
                       initialValues={UserInitials}
                       validationSchema={Validation_Schema}
                       onSubmit={confirm}
                   >
                       {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, }) => (
                       <Form>
               <h6 class="text-uppercase">Payment details</h6>
               <div class="inputbox mt-3"> 
               <input type="text" name="name" class="form-control" 
                value={values.card_name}
                onChange={handleChange("card_name")}
                onBlur={() => setFieldTouched("card_name")}
                onChangeCapture={(e) => (setcard_name(e.target.value))}
               /> 
               <span>Name on card</span> 
               {errors.card_name && touched.card_name ? <div className="errmsg">{errors.card_name}</div> : null}
               </div>
               <div class="row">
                   <div class="col-md-6">
                       <div class="inputbox mt-3 mr-2"> 
                       <input type="text" name="name" class="form-control"
                        value={values.card_no}
                        onChange={handleChange("card_no")}
                        onBlur={() => setFieldTouched("card_no")}
                        onChangeCapture={(e) => (setcard_no(e.target.value))}
                       /> <i class="fa fa-credit-card"></i>
                        <span>Card Number</span> </div>
                        {errors.card_no && touched.card_no ? <div className="errmsg">{errors.card_no}</div> : null}
                   </div>
                   <div class="col-md-6">
                       <div class="d-flex flex-row">
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control"
                            value={values.exp}
                            onChange={handleChange("exp")}
                            onBlur={() => setFieldTouched("exp")}
                            onChangeCapture={(e) => (setexp(e.target.value))} 
                           
                           />
                            <span>Expiry</span>
                            {errors.exp && touched.exp ? <div className="errmsg">{errors.exp}</div> : null}
                            </div>
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control" 
                           value={values.cvv}
                           onChange={handleChange("cvv")}
                           onBlur={() => setFieldTouched("cvv")}
                           onChangeCapture={(e) => (setcvv(e.target.value))} 
                           />
                            <span>CVV</span> 
                            {errors.cvv && touched.cvv ? <div className="errmsg">{errors.cvv}</div> : null}
                            </div>
                       </div>
                   </div>
               </div>
               <div class="mt-4 mb-4">
                   <h6 class="text-uppercase">Shipping Address</h6>
                   <div class="row mt-3">
                       <div class="col-md-6">
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control" 
                            value={values.street}
                            onChange={handleChange("street")}
                            onBlur={() => setFieldTouched("street")}
                            onChangeCapture={(e) => (setstreet(e.target.value))}
                           /> 
                           <span>Street Address</span> 
                           {errors.street && touched.street ? <div className="errmsg">{errors.street}</div> : null}
                           </div>
                       </div>
                       <div class="col-md-6">
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control"
                           value={values.city}
                           onChange={handleChange("city")}
                           onBlur={() => setFieldTouched("city")}
                           onChangeCapture={(e) => (setcity(e.target.value))}
                           /> 
                           <span>City</span> 
                           {errors.city && touched.city ? <div className="errmsg">{errors.city}</div> : null}
                           </div>
                       </div>
                   </div>
                   <div class="row mt-2">
                       <div class="col-md-6">
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control" 
                           value={values.state}
                           onChange={handleChange("state")}
                           onBlur={() => setFieldTouched("state")}
                           onChangeCapture={(e) => (setstate(e.target.value))}
                           /> 
                           <span>State/Province</span> 
                           {errors.state && touched.state ? <div className="errmsg">{errors.state}</div> : null}
                           </div>
                       </div>
                       <div class="col-md-6">
                           <div class="inputbox mt-3 mr-2"> 
                           <input type="text" name="name" class="form-control"
                           value={values.zipcode}
                           onChange={handleChange("zipcode")}
                           onBlur={() => setFieldTouched("zipcode")}
                           onChangeCapture={(e) => (setzipcode(e.target.value))}
                           /> 
                           <span>Zip code</span> 
                           {errors.zipcode && touched.zipcode ? <div className="errmsg">{errors.zipcode}</div> : null}
                           </div>
                       </div>
                   </div>
                   <div class="mt-4 mb-4 d-flex justify-content-between">
                     <Button variant="contained" onClick={()=>history.push("/product")}>Cancel</Button>
                     <Button variant="outlined" disabled={!isValid} onClick={(e) => handleSubmit(e)}>Pay ₹{localStorage.getItem("totalpay")}</Button>
                   </div>
                   
               </div>
               </Form>
           )}
         </Formik>
           </div>
       </div>
         }   
           
         </div>  
      </Dialog>
</div>



    );
}