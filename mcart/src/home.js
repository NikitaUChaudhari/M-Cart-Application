import { Button,Container,Paper } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useState,useEffect } from "react";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

function Home() {
    const history = useHistory();
       
    return (
        <div className="landingOut">
        <div className="logobox">
          <h2>M-Cart</h2>
        </div>
        <Container>
            <div className="landingPageRow">
              <div className="landingInner">
                 <div className="innBoxlanding">
                    <span className="landingIcon"><SupervisorAccountIcon/></span>
                    <br/><br/><br/>
                    <h4>Admin Login</h4>
                    <br/><br/>
                    <a className="btnl" onClick={() => history.push("/adminlogin")}>Proceed</a>
                 </div>
               </div>
               <div className="landingInner">
                 <div className="innBoxlanding">
                     <span className="landingIcon"><AccountBoxIcon/></span>
                     <br/><br/><br/>
                     <h4>User Login/Registration</h4>
                     <br/><br/>
                     <a className="btnl" onClick={() => history.push("/Login-user")}>Proceed</a>
                 </div>
               </div>
               
            </div>
        </Container>
      </div>

    );
  }
  
  export default Home;
  