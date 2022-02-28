import { useState,useEffect } from "react";
import { Button,Container,Paper,Box,Dialog,TextField} from "@mui/material";
import { useHistory } from "react-router-dom";
import { makePostRequest } from '../util/utils';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import swal from "sweetalert";



const Validation_Schema = Yup.object().shape({
    
    email: Yup.string().email('Invalid email').required('Please Enter the email'),

    password: Yup.string().required('Please Enter the password')
   
});

function Home() {
    const history = useHistory();
    const [open, setOpen] =useState(false);  
    const [islogin,setislogin]=useState(localStorage.getItem("user_id"))
    const[email,setemail]=useState('');
    const[password,setpassword]=useState('');


    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }; 

    function loginuser(){
        let bodyFormData = new FormData();
        bodyFormData.append("email",email);
        bodyFormData.append("password",password);
        makePostRequest("/loginuser", bodyFormData).then((response) => {
            if (response.data.status === "1") {
                swal("Success","Welcome to M-cart", "success");
                localStorage.setItem("logintype","user")
                localStorage.setItem("user_id",response.data.data[0].uid)
                localStorage.setItem("uname",response.data.data[0].fname)
                localStorage.setItem("uemail",response.data.data[0].email)
                localStorage.setItem("uimg",response.data.data[0].profile)
                history.push("/product")
            }else{  
                swal("Error",response.data.message, "warning"); 
            }
                    
        }).catch((err) => {
                 swal("There was an error!", "more error details", "warning");
        });
    }

    useEffect(()=>{
      
         handleClickOpen()
          
    })

    var UserInitials = {
        email:"",
        password:"",
        
    };
    

    return (
<div>
<div class="container">
<Formik
        enableReinitialize
        initialValues={UserInitials}
        validationSchema={Validation_Schema}
        onSubmit={loginuser}
    >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, }) => (
            <Form>	
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card-group mb-0">
       
          <div class="card p-4 boxsize">
            <div class="card-body">
              <h1>Login</h1>
              <p class="text-muted">Sign In to your account</p>
              <div class="input-group mb-3">
                <span class="input-group-addon"><i class="fa fa-user"></i></span>
                <input type="text" class="form-control" placeholder="Username"
                value={values.email}
                onChange={handleChange("email")}
                onBlur={() => setFieldTouched("email")}
                onChangeCapture={(e) => (setemail(e.target.value))}
                />
            
              </div>
              {errors.email && touched.email ? <div className="errmsg">{errors.email}</div> : null}
              <div class="input-group mb-4">
                <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                <input type="password" class="form-control" placeholder="Password"
                 value={values.password}
                 onChange={handleChange("password")}
                 onBlur={() => setFieldTouched("password")}
                 onChangeCapture={(e) => (setpassword(e.target.value))}
                />
            
              </div>
              {errors.password && touched.password ? <div className="errmsg">{errors.password}</div> : null}
              <div class="row">
                <div class="col-6">
                  <button type="button" class="btn btn-primary px-4" disabled={!isValid} onClick={(e) => handleSubmit(e)}>Login</button>
                </div>
                <div class="col-6 text-right">
                  <button type="button" class="btn btn-link px-0" onClick={()=>history.push("/forgot/password")}>Forgot password?</button>
                </div>
              </div>
            </div>
          </div>
          <div class="card text-white bg-primary py-5 d-md-down-none boxsize">
            <div class="card-body text-center">
              <div>
                <h2>Sign up</h2>
                <p>Fill out the form to sign up to our service.</p>
                <button type="button" class="btn btn-primary" onClick={()=>history.push("/Register-user")}>Register Now!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Form>
      )}
    </Formik>
  </div>
</div>

    );
  }
  
  export default Home;
  