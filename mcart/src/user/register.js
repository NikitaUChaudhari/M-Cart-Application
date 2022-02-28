import React, { useState } from 'react';
import {Paper,Button,Container,Checkbox,TextField,Grid} from '@mui/material';

import { useHistory } from "react-router-dom";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makePostRequest } from '../util/utils';
import swal from "sweetalert";




const Validation_Schema = Yup.object().shape({
    fname: Yup.string().required('Required'),

    lname: Yup.string().required('Required'),

    mobile: Yup.string().required('Required')
    .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone number is not valid')
    .max(10, 'phone no must be greater than or equal to 10 digits')
    .min(10, 'phone no must be contain 10 digits'),
  
    email: Yup.string().email('Invalid email').required('Required'),

    password: Yup.string().required('Please Enter your password').matches(
         /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"),
    cpassword: Yup.string().required('Please confirm the password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')    

});

	

function Register() {
    const history = useHistory();
    const[chkval,setchkval]=React.useState(false)
    const[fname,setfname]=useState('');
    const[lname,setlname]=useState('');
    const[email,setemail]=useState('');
    const[mobile,setmobile]=useState('');
    const[password,setpassword]=useState('');
    const[cpassword,setcpassword]=useState('');
    

    const [selectedFile, setSelectedFile] = React.useState();
   
    const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
      console.log(selectedFile)
    };
    
    
    const checkboxadd = (e) => {
        if(e===false)
        {      setchkval(true);}
        else{
        setchkval(false);
        }
        console.log(chkval)
    };

    function adduser(){
        if (chkval===true){
            if(selectedFile.name===null){
                swal("Warning","Profile is requird", "warning");
            }else{
                let bodyFormData = new FormData();
                bodyFormData.append("fname",fname);
                bodyFormData.append("lname",lname);
                bodyFormData.append("email",email);
                bodyFormData.append("password",password);
                bodyFormData.append("mobile_no",mobile);
                bodyFormData.append("Profile",selectedFile);
                makePostRequest("/adduser", bodyFormData).then((response) => {
                    if (response.data.status === "1") {
                        
                            localStorage.setItem("regemail",email)
                            history.push("/userverify")
                        
                        
                      }else{  
                        swal("Error",response.data.message, "warning"); 
                      }
                    
                  }).catch((err) => {
                    swal("There was an error!", "more error details", "warning");
                  });
            }
        }else{
            swal("Warning","Please indicate that you have read and agree to the Terms and Conditions and Privacy Policy", "warning");
          
        }
        
    }


    var UserInitials = {
        fname:"",
        lname:"",
        email:"",
        mobile:"",
        password:"",
        cpassword:"",
    };
    

    return (
       <div className="mainBoxInner">
                 <div className="LoginBox" >
                    <div className="plashInner-reg">
                    <h1>Registration</h1>
                    <Formik
                        enableReinitialize
                        initialValues={UserInitials}
                        validationSchema={Validation_Schema}
                        onSubmit={adduser}
                    >
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, }) => (
                        <Form>
					<Grid container spacing={3}>
                    
                        <Grid item xs={6}>
                        <TextField  id="firstName" label="Enter first name" className="myInput"
                        value={values.fname}
                        onChange={handleChange("fname")}
                        onBlur={() => setFieldTouched("fname")}
                        onChangeCapture={(e) => (setfname(e.target.value))}
                        />
                         {errors.fname && touched.fname ? <div className="errmsg">{errors.fname}</div> : null}
                      
                        </Grid>
                        <Grid item xs={6}>
                        <TextField id="lastName" label="Enter last name" className="myInput" 
                        value={values.lname}
                        onChange={handleChange("lname")}
                        onBlur={() => setFieldTouched("lname")}
                        onChangeCapture={(e) => (setlname(e.target.value))}
                        />
                        {errors.lname && touched.lname ? <div className="errmsg">{errors.lname}</div> : null}
                        </Grid>
                        <Grid item xs={6}>
                        <TextField id="email" label="Enter email address" className="myInput"
                        value={values.email}
                        onChange={handleChange("email")}
                        onBlur={() => setFieldTouched("email")}
                        onChangeCapture={(e) => (setemail(e.target.value))}
                        />
                        {errors.email && touched.email ? <div className="errmsg">{errors.email}</div> : null}
                        </Grid>
                        <Grid item xs={6}>
                        <TextField id="mobile" label="Enter mobile number" className="myInput"
                        value={values.mobile}
                        onChange={handleChange("mobile")}
                        onBlur={() => setFieldTouched("mobile")}
                        onChangeCapture={(e) => (setmobile(e.target.value))}
                        />
                        {errors.mobile && touched.mobile ? <div className="errmsg">{errors.mobile}</div> : null}
                        </Grid>
                        <Grid item xs={6}>
                        <TextField type="password" id="password" label="Create password" className="myInput"
                        value={values.password}
                        onChange={handleChange("password")}
                        onBlur={() => setFieldTouched("password")}
                        onChangeCapture={(e) => (setpassword(e.target.value))}
                        />
                        {errors.password && touched.password ? <div className="errmsg">{errors.password}</div> : null}
                        </Grid>
                        <Grid item xs={6}>
                        <TextField type="password" id="cpassword" label="Confirm password" className="myInput"
                        value={values.cpassword}
                        onChange={handleChange("cpassword")}
                        onBlur={() => setFieldTouched("cpassword")}
                        onChangeCapture={(e) => (setcpassword(e.target.value))}
                        />
                        {errors.cpassword && touched.cpassword ? <div className="errmsg">{errors.cpassword}</div> : null}
                        </Grid>
                        <Grid item xs={12}>
                          <input type="file" name="file"  onChange={changeHandler} /> 
                        </Grid>
                        </Grid>

                        
                    <div className="checkBox">
                         <Checkbox inputProps={{ 'aria-label': 'primary checkbox' }} value={chkval} onClick={(e)=>checkboxadd(chkval)}/>
                         I agree to the Terms & Conditions & Privacy Policy    
                    </div>  
                    <Button variant="contained" color="primary" disabled={!isValid} onClick={(e) => handleSubmit(e)} className="buttBottomSpace">
                        Register
                    </Button>
                      </Form>
                      )}
                    </Formik>
                    <p className="newuser">Already have account? <p onClick={()=>history.push("/Login-user")} >Sign In</p></p>
                   </div>
                </div>
           </div>
    );
  }
  
  export default Register;
  