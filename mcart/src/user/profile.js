import React,{useState,useEffect} from 'react';
import { Container, Paper, Typography, Box, Button,List,ListItem}from '@mui/material';
import { useHistory} from "react-router-dom";
import { makeGetRequest} from '../util/utils';
import swal from "sweetalert";
import Dashboard from './dashboard';
import { FaEdit } from "react-icons/fa";
import {Avatar,Badge} from '@mui/material';


export default function  Profile(){
const [data,setdata]=useState([])


    async function viewuser(){
        let bodyFormData = new FormData();
        makeGetRequest("/viewuser/"+localStorage.getItem("user_id"), bodyFormData).then((response) => {
            if(response.data.status === "1") {
                setdata(response.data.data[0])
            }else{
                setdata([])
            }    
        }).catch((err) => {
          swal("There was an error!", "more error details", "warning");
        });
      }
  
      useEffect(()=>{
          viewuser()
      },[])
const history=useHistory()
    
    return(
        <div >
            <Dashboard/>
           <div >
           <Container maxWidth="md">
                <Paper spacing={3} className="plashPaper"  >
                    <h1 className="txtcol">User Profile</h1>
                    <Box className="profilePicInner" >
                            <Badge
                            overlap="circle"
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                            }}
                            >
                            <Avatar style={{height:'100px', width:'100px'}} alt="Travis Howard" src={process.env.PUBLIC_URL + `/uploads/${data.profile}`} />
                            </Badge>
                            </Box>
                        <Box className="alignbox">
                            <Box className="msgtxt"> 
                            <p className='msg'> Welcome {data.fname}  {data.lname} </p>
                            </Box>
                            <Box className="logOut">
                                <Button className='outButton' onClick={()=>history.push("/logout")}>
                                   LogOut
                                </Button>
                                <br/>
                                <Button className='outButton' onClick={()=>history.push("/edituser/"+localStorage.getItem("user_id"))}>
                                   Edit
                                </Button>
                            </Box>
                            
                        </Box>   
                    <Box className=" popupSpace memberDetails noSpaceSide">
                               
                        <Box className="profileDetails">
                            
                            <br/>
                            <List> 
                                <ListItem>
                                    <label>Name</label>
                                    <span> {data.fname}  {data.lname} </span>
                                </ListItem> 
                                <ListItem>
                                    <label>Email Address</label>
                                    <span> {data.email}  </span>
                                </ListItem>
                                <ListItem>
                                    <label>Mobile Number</label>
                                    <span> {data.mobile_no}</span>
                                </ListItem>
                                
                            </List>    
                        </Box>
                    </Box>
                </Paper>
            </Container>
            </div>
        </div>
    );
}