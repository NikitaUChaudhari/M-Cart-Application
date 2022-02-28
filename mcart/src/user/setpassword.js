import { Button,Container,Paper } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useState,useEffect } from "react";
import swal from "sweetalert";
import { makePostRequest } from '../util/utils';


function SetPassword() {
    const history = useHistory();
    const [pass,setpass]=useState('');

    async function passwordSet(){
        var bodyFormData=new FormData()
        bodyFormData.append("email",localStorage.getItem("setemail2"));
        bodyFormData.append("password",pass);
        makePostRequest("/forgot/password", bodyFormData).then((response) => {
            if (response.data.status === "1") {
                swal("Success","Password set successfully", "success")
                .then(function() {
                  localStorage.clear()
                  history.push("/Login-user")
              });
              
              }else{  
                swal("Error","Mail Failed", "warning"); 
              }
            
          }).catch((err) => {
            swal("There was an error!", "more error detailsssss", "warning");
          });
    }
    
    function setq(e){
        setpass(e.target.value)
    }
       
    return (
      <div>
        <Container>
        <div class="container padding-bottom-3x mb-2 mt-5">
	    <div class="row justify-content-center">
	        <div class="col-lg-8 col-md-10">
	            <div class="forgot">
	                <h3>Wellcome {localStorage.getItem("setemail2")}</h3>
	                <div > 
                        <label for="email-for-pass">Enter your new password</label> 
                        <input  type="password" id="email-for-pass" required="" onChange={setq} /> 
	                </div>
	                <div>
                          <button class="btn-success" onClick={passwordSet}>Set New Password</button> &nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
	            </div>
	        </div>
	    </div>
	</div>
        </Container>
      </div>

    );
  }
  
  export default SetPassword;
  