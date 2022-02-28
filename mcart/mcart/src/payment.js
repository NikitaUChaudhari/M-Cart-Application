import React, { useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Button} from "@mui/material";

import swal from "sweetalert";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makeGetRequest, makePostRequest } from './util/utils';

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

export default function Payment(){
    const history = useHistory();
    const [card_name,setcard_name]=useState();
    const [card_no,setcard_no]=useState();
    const [exp,setexp]=useState();
    const [cvv,setcvv]=useState();

    const [street,setstreet]=useState();
    const [city,setcity]=useState();
    const [state,setstate]=useState();
    const [zipcode,setzipcode]=useState();
    const {mode} =useParams();


async function pay(){
  let bodyFormData = new FormData();
    bodyFormData.append("card_name",card_name);
    bodyFormData.append("card_no",card_no);
    bodyFormData.append("expiry",exp);
    bodyFormData.append("cvv",cvv);
    bodyFormData.append("street",street);
    bodyFormData.append("city",city);
    bodyFormData.append("state",state);
    bodyFormData.append("zipcode",zipcode);
    bodyFormData.append("uid",localStorage.getItem("user_id"));
    bodyFormData.append("paid_amt",localStorage.getItem("totalpay"));
  makePostRequest("/addorder", bodyFormData).then((response) => {
      if (response.data.status === "1") {
          swal("Success",response.data.message, "success");
          mailsend();
        }else{  
          swal("Error",response.data.message, "warning"); 
        }
      
    }).catch((err) => {
      swal("There was an error!", "more error detail", "warning");
    });
}

async function mailsend(){
  let bodyFormData = new FormData();
  bodyFormData.append("fname",localStorage.getItem("uname"));
  bodyFormData.append("email",localStorage.getItem("uemail"));
  bodyFormData.append("paid_amt",localStorage.getItem("totalpay"));
  makePostRequest("/paymentmail", bodyFormData).then((response) => {
    if (response.data.status === "1") {
        swal("Success","Mail send Successfully", "success");
      }else{  
        swal("Error","Payment Mail Failed", "warning"); 
      }
    
  }).catch((err) => {
    swal("There was an error!", "more error detailsssss", "warning");
  });

}




    const UserInitials ={
      card_name: '',
      card_no: '',
      exp: '',
      cvv: '',
      street: '',
      city: '',
      state: '',
      zipcode: ''
    }
   
    return(
        
<div className='color'>
{
    (mode=="a")?
    <div className='container'>
    <div >
    <div class="mb-4 text-white text-center">
        <h2>Confirm order and pay</h2> <span>please make the payment, after that you can enjoy all the features and benefits.</span>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="card card-blue p-3 text-white mb-3"> <span>You have to pay</span>
                <div class="d-flex flex-row align-items-end mb-3">
                    <h1 class="mb-0 yellow">₹{localStorage.getItem("totalpay")}</h1> 
                </div> <span>Enjoy all the features and perk after you complete the payment</span> <a href="#" class="yellow decoration">Know all the features</a>
            </div>
        </div>
        <div class="col-md-8">
            <div class="card p-3">
            <Formik
                        enableReinitialize
                        initialValues={UserInitials}
                        validationSchema={Validation_Schema}
                        onSubmit={pay}
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
                    <h6 class="text-uppercase">Billing Address</h6>
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
        
    </div>
</div>
    </div>
    :<div>Cod</div>
}
    


</div>






    )
}
