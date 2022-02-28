import { Button,Container,Paper } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useState,useEffect } from "react";
import swal from "sweetalert";
import { makePostRequest } from '../util/utils';


export default function UserVerify() {
    const history = useHistory();
    const [q, setq] = useState();
    console.log(Math.floor(100000 + Math.random() * 900000));
    // var generator = require('generate-password');
    // var password = generator.generate({
    //     length: 6,
    //     numbers: true,
    //     lowercase:false,
    //     uppercase:false
    // });
    const [chk,setchk]=useState(Math.floor(100000 + Math.random() * 900000))

   

    function verify(){
        if(chk==q){
            swal("Success","Email Is Verify Successfully", "success")
            .then(function() {
                history.push("/Login-user")
                localStorage.clear()
            });
            
        }else{
            swal("Error","You have enter wrong OTP", "error")
        }
    }    

    async function sendmail(){
        var bodyFormData=new FormData()
        bodyFormData.append("otp",chk);
        bodyFormData.append("email",localStorage.getItem("regemail"));
        makePostRequest("/user/reg", bodyFormData).then((response) => {
            if (response.data.status === "1") {
                swal("Success","Please check your mail box", "success");
              }else{  
                swal("Error","Mail Failed", "warning"); 
              }
            
          }).catch((err) => {
            swal("There was an error!", "more error detailsssss", "warning");
          });
    }
    
    function otp(e){
        setq(e.target.value)
    }
    useEffect(()=>{
        sendmail();
    },[])
       
    return (
<div id="app">
    <div class="container1 height-100 d-flex justify-content-center align-items-center">
        <div class="position-relative">
            <div class="card1 p-2 text-center">
                <h6>Please enter the one time password<br/> </h6>
                <div> <span> sent to your mail</span> <small>{localStorage.getItem("regemail")}</small> </div>
                <div id="otp" class="inputs d-flex flex-row justify-content-center mt-2"> 
                <input class="m-2 text-center form-control rounded" placeholder="Enter digit code here" type="text" onChange={otp} /> 
                
                </div>
                <div class="mt-4"> <button class="btn btn-danger px-4 validate" onClick={verify}>Validate</button> </div>
                <div class="mt-3 content d-flex justify-content-center align-items-center">
                </div> 
            </div>
        </div>
    </div>
</div>
    );
  }

  