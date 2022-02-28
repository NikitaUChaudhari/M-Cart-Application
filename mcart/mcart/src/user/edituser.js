import React, { useEffect, useState } from 'react';
import {Paper,Button,Container,Checkbox,TextField,Grid} from '@mui/material';

import { useHistory ,useParams} from "react-router-dom";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makePostRequest ,makeGetRequest} from '../util/utils';
import swal from "sweetalert";





const Validation_Schema = Yup.object().shape({
    fname: Yup.string().required('Required'),

    lname: Yup.string().required('Required'),

    mobile: Yup.string().required('Required')
    .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone number is not valid')
    .max(10, 'phone no must be greater than or equal to 10 digits')
    .min(10, 'phone no must be contain 10 digits'),
  
    email: Yup.string().email('Invalid email').required('Required'),

       

});

	

function Edituser() {
    const history = useHistory();
    const[fname,setfname]=useState('');
    const[lname,setlname]=useState('');
    const[email,setemail]=useState('');
    const[mobile,setmobile]=useState('');
    const{id}=useParams()
    
   

    function edituser(){
                let bodyFormData = new FormData();
                bodyFormData.append("fname",fname);
                localStorage.setItem("uname",fname);
                bodyFormData.append("lname",lname);
                bodyFormData.append("email",email);
                bodyFormData.append("mobile_no",mobile);
                makePostRequest("/edituser/"+id, bodyFormData).then((response) => {
                    if (response.data.status === "1") {
                        swal("Success",response.data.message, "success");
                        if(localStorage.getItem("logintype")=="user"){
                          history.push("/profile")
                        }else{
                          history.push("/manageuser")
                        }
                        
                      }else{  
                        swal("Error",response.data.message, "warning"); 
                      }
                    
                  }).catch((err) => {
                    swal("There was an error!", "more error details", "warning");
                  });
            }
        

    async function viewuser(){
      let bodyFormData = new FormData();
      makeGetRequest("/viewuser/"+id, bodyFormData).then((response) => {
        setfname(response.data.data[0].fname)
        setlname(response.data.data[0].lname)
        setemail(response.data.data[0].email)
        setmobile(response.data.data[0].mobile_no)
        
      }).catch((err) => {
        swal("There was an error!", "more error details", "warning");
      });
    }

    useEffect(()=>{
        viewuser()
    },[])


    var UserInitials = {
        fname:fname,
        lname:lname,
        email:email,
        mobile:mobile
    };
    

    return (
       <div className="plashBox">
          
           <div className="mainBoxInner">
           <Container maxWidth="md">
                 <Paper spacing={3} className="LoginBox" >
                    <div className="plashInner-reg">
                    <h1 className="registration">Edit User</h1>
                    <Formik
                        enableReinitialize
                        initialValues={UserInitials}
                        validationSchema={Validation_Schema}
                        onSubmit={edituser}
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
                        
                        </Grid>

                        
                    <Button variant="contained" color="primary" disabled={!isValid} onClick={(e) => handleSubmit(e)} className="buttBottomSpace">
                        Update
                    </Button>
                      </Form>
                      )}
                    </Formik>
                    </div>
                </Paper>
            </Container>    
           </div>
      
       </div>

    );
  }
  
  export default Edituser;
  