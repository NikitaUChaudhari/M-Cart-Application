import { Button,Container,Paper } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useState,useEffect } from "react";
import { makeGetRequest} from '../util/utils';
import swal from "sweetalert";
import moment from 'moment/moment.js'
import Dashboard from './dashboard';

function Myorder() {
    const history = useHistory();
    const [data,setdata]=useState([])


    async function vieworder(){
        let bodyFormData = new FormData();
        makeGetRequest("/getorder/"+localStorage.getItem("user_id"), bodyFormData).then((response) => {
            if(response.data.status === "1") {
                setdata(response.data.data)
            }else{
                setdata([])
            }    
        }).catch((err) => {
          swal("There was an error!", "more error details", "warning");
        });
      }
  
      useEffect(()=>{
        vieworder()
      },[])
    return (
<div>
    <Dashboard/>
<section class="h-100 gradient-custom">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-lg-10 col-xl-8">
        <div class="card" >
          <div class="card-header px-4 py-5">
            <h5 class="text-muted mb-0">Thanks for your Order, <span >{localStorage.getItem("uname")}</span>!</h5>
          </div>
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <p class="lead fw-normal mb-0" >Receipt</p>
              <p class="small text-muted mb-0">Receipt Voucher : 1KAU9-84UIL</p>
            </div>
           
           
            { (data.length>0)?data.map(p=>           
            <div class="card shadow-0 border mb-4">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <p class="small text-muted mb-0">Order Date: {moment(p.pdate).format("MMM Do YY")}</p>
                </div>
              <hr class="mb-4" />
                <div class="row">
                  <div class="col-md-2">
                    <img src={process.env.PUBLIC_URL + `/uploads/products/${p.img}`} alt="img"  class="img-fluid" />
                  </div>
                  <div class="col-md-4 text-center d-flex justify-content-center align-items-center">
                    <p class="text-muted mb-0">{p.pname}</p>
                  </div>
                  <div class="col-md-4 text-center d-flex justify-content-center align-items-center">
                    <p class="text-muted mb-0 small">{p.pdescription}</p>
                  </div>
                
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text-muted mb-0 small">₹ {p.price}</p>
                  </div>
                </div>
                <hr class="mb-4" />
                <div class="row d-flex align-items-center">
                  <div class="col-md-2">
                    <p class="text-muted mb-0 small">Track Order</p>
                  </div>
                  <div class="col-md-10">
                    {/* <div class="progress" >
                      <div
                        class="progress-bar"
                        role="progressbar"
                        aria-valuenow="65"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div> */}
                    <div class="d-flex justify-content-around mb-1">
                      <p class="text-muted mt-1 mb-0 small ms-xl-5">{p.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
            :<p className="text-center">No data found</p>
            }

           
          </div>
          
        </div>
      </div>
    </div>
  </div>
</section>
</div>

    );
  }
  
  export default Myorder;
  