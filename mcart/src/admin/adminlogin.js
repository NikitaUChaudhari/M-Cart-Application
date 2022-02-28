import { useState,useEffect } from "react";
import { Button,Container,Paper,Box,Dialog,TextField} from "@mui/material";
import { useHistory } from "react-router-dom";
import { makePostRequest } from '../util/utils';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import swal from "sweetalert";



const Validation_Schema = Yup.object().shape({
    
    email: Yup.string().required('Please Enter the Username'),

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
        makePostRequest("/loginadmin", bodyFormData).then((response) => {
            if (response.data.status === "1") {
                swal("Success","Wellcome to M-cart", "success");
                localStorage.setItem("logintype","admin")
                localStorage.setItem("admin_id",response.data.data[0].admin_id)
                localStorage.setItem("username",response.data.data[0].username)
                localStorage.setItem("aemail",response.data.data[0].email)
                history.push("/sidebar")
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
        
    <Box className="dialogSpace">  
        <Paper spacing={3} className="LoginBox" >
                    <div className="plashInner">
                    <h1>Sign In (Admin)</h1>
                    <Formik
                        enableReinitialize
                        initialValues={UserInitials}
                        validationSchema={Validation_Schema}
                        onSubmit={loginuser}
                    >
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, }) => (
                        <Form>		
                    <TextField id="email" label="Enter Username" className="myInput"
                        value={values.email}
                        onChange={handleChange("email")}
                        onBlur={() => setFieldTouched("email")}
                        onChangeCapture={(e) => (setemail(e.target.value))}
                    />
                    {errors.email && touched.email ? <div className="errmsg">{errors.email}</div> : null}

                    <TextField id="password" label="Enter Your Password" type="password" className="myInput"
                        value={values.password}
                        onChange={handleChange("password")}
                        onBlur={() => setFieldTouched("password")}
                        onChangeCapture={(e) => (setpassword(e.target.value))}
                    />
                    {errors.password && touched.password ? <div className="errmsg">{errors.password}</div> : null}

                    <Button variant="contained" color="primary"  disabled={!isValid} onClick={(e) => handleSubmit(e)} >
                        Sign In
                    </Button>
                    </Form>
                      )}
                    </Formik>
                   </div>
                </Paper>
        </Box> 


    );
  }
  
  export default Home;
  