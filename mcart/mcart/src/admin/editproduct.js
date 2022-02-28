import React, { useState,useEffect } from 'react';
import {Paper,Button,Container,Checkbox,TextField,Grid} from '@mui/material';

import { useHistory ,useParams} from "react-router-dom";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { makePostRequest,makeGetRequest } from '../util/utils';
import swal from "sweetalert";
import InputLabel from '@mui/material/InputLabel';




const Validation_Schema = Yup.object().shape({
    pname: Yup.string().required('Required'),
    // category: Yup.string().required('Required'),
    pdesc: Yup.string().required('Required'),
    stock:Yup.string()
      .matches(/^\d+$/, 'The field should have digits only')
      .required('Required'),
    price:Yup.string()
      .matches(/^\d+$/, 'The field should have digits only')
      .required('Required'),
   

});

	

function Edit() {
    const history = useHistory();
    const[pname,setpname]=useState('');
    const[pdesc,setpdesc]=useState('');
    const[price,setprice]=useState('');
    const[stock,setstock]=useState('');
    // const[category,setcategory]=useState('');
    const {id}=useParams()

    
    

            function addproduct(){
        
                let bodyFormData = new FormData();
                  bodyFormData.append("pname",pname);
                  bodyFormData.append("pdesc",pdesc);
                  bodyFormData.append("price",price);
                  bodyFormData.append("stock",stock);
                makePostRequest("/editproduct/"+id, bodyFormData).then((response) => {
                    if (response.data.status === "1") {
                        swal("Success",response.data.message, "success");
                        history.push("/manageproduct")
                      }else{  
                        swal("Error",response.data.message, "warning"); 
                      }
                    
                  }).catch((err) => {
                    swal("There was an error!", "more error details", "warning");
                  });
            }
        

    async function viewuser(){
        let bodyFormData = new FormData();
        makeGetRequest("/viewproduct/"+id, bodyFormData).then((response) => {
          setpname(response.data.data[0].pname)
          setprice(response.data.data[0].price)
          setstock(response.data.data[0].stock)
          setpdesc(response.data.data[0].pdescription)
          
          
        }).catch((err) => {
          swal("There was an error!", "more error details", "warning");
        });
      }
      
      useEffect(()=>{
          viewuser()
      },[])


      

    var UserInitials = {
        pname:pname,
        pdesc:pdesc,
        price:price,
        stock:stock,
    };
    
    return (
       <div className="plashBox">
          
           <div className="mainBoxInner">
           <Container maxWidth="md">
                 <Paper spacing={3} className="LoginBox" >
                    <div className="plashInner-reg">
                    <h3 className="registration">Update Products</h3>
                    <Formik
                        enableReinitialize
                        initialValues={UserInitials}
                        validationSchema={Validation_Schema}
                        onSubmit={addproduct}
                    >
                        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, }) => (
                        <Form>
					<Grid container spacing={3}>
                    
                        <Grid item xs={12}>
                                <TextField   label="Enter Product name" className="myInput"
                                value={values.pname}
                                onChange={handleChange("pname")}
                                onBlur={() => setFieldTouched("pname")}
                                onChangeCapture={(e) => (setpname(e.target.value))}
                                />
                                {errors.pname && touched.pname ? <div className="errmsg">{errors.pname}</div> : null}
                        </Grid>
                        <Grid item xs={12}>
                       
                        {/* <div className="inputOut">
                          <Select className="myInput"
                          // value={category}
                           onChange={handleChangecat}        
                          >
                            <MenuItem value="" disabled> Select Category</MenuItem>  
                            <MenuItem value="ELECTRONICS"  > ELECTRONICS</MenuItem>
                            <MenuItem value="BOOKS"  >BOOKS</MenuItem>
                          </Select> 
                        </div> */}
                      
                        </Grid>
                        <Grid item xs={12}>
                                <TextField   label="Enter Product Description" className="myInput"
                                value={values.pdesc}
                                onChange={handleChange("pdesc")}
                                onBlur={() => setFieldTouched("pdesc")}
                                onChangeCapture={(e) => (setpdesc(e.target.value))}
                                />
                                {errors.pdesc && touched.pdesc ? <div className="errmsg">{errors.pdesc}</div> : null}
                        </Grid>
                        <Grid item xs={12}>
                                <TextField   label="Enter Product price" className="myInput"
                                value={values.price}
                                onChange={handleChange("price")}
                                onBlur={() => setFieldTouched("price")}
                                onChangeCapture={(e) => (setprice(e.target.value))}
                                />
                                {errors.price && touched.price ? <div className="errmsg">{errors.price}</div> : null}
                        </Grid>
                        <Grid item xs={12}>
                                <TextField   label="Enter Product Stock" className="myInput"
                                value={values.stock}
                                onChange={handleChange("stock")}
                                onBlur={() => setFieldTouched("stock")}
                                onChangeCapture={(e) => (setstock(e.target.value))}
                                />
                                {errors.stock && touched.stock ? <div className="errmsg">{errors.stock}</div> : null}
                        </Grid>
                        
                       
                        </Grid>

                    <Button variant="contained" color="primary" disabled={!isValid} onClick={(e) => handleSubmit(e)} className="buttBottomSpace">
                        Update Product
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
  
  export default Edit;
  