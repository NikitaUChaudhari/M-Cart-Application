import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import * as React from 'react';
import Box from '@mui/material/Box';
import {Button,Paper} from '@mui/material';
import TextField from '@mui/material/TextField';
import { makePostRequest, makeGetRequest } from "../util/utils";
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Sidebar from './sidebar';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';



export default function ViewUser() {
    const history=useHistory();
    const[info,setinfo]=useState([]);
    const[page,setpage]=useState(1);
    const[perpage,setperpage]=useState(5);
    const[cid,setcid]=useState();
    const [open, setOpen] =useState(false);

    const[search,setsearch]=useState([]);
    const[find,setfind]=useState('');
    const[pages,setpages]=useState(1);

    

    async function view_user() {
        let bodyFormData=new FormData();
        makeGetRequest(`/viewallusers?page=${page}&perpage=${perpage}&delay=1`,bodyFormData).then((response)=> {
            if(response.data.status === "1") {
                  setinfo(response.data);
            }
            else {
                  swal("there was an  error","failed to load", "warning");
            }
        })
        .catch((err) => {
             swal("There was an error!","more error details", "warning");
        });
    }


    async function searchuser() {
        let bodyFormData=new FormData();
        makeGetRequest(`/searchusers?pages=${pages}&perpage=${perpage}&find=${find}&delay=1`,bodyFormData).then((response)=> {
            if(response.data.status === "1") {
                  setsearch(response.data);
            }
            else {
                 setsearch([])
            }
        })
        .catch((err) => {
             swal("There was an error!","more error details.", "warning");
        });
    }
  

    //
    const handleClickOpen = (id) => {
        setcid(id);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    // delete user
    async function delete_user()
    {
      let bodyFormData=new FormData();
      makePostRequest(`/deleteuser/${cid}`,bodyFormData).then((response)=> {
          if(response.data.status === "1") {
              swal("Deleted","Record Deleted!!!", "success");
              setOpen(false)
              setTimeout(() => {
                  window.location.reload()
              },3000);
              
          }
          else {
                swal("there was an  error","failed to delete", "warning");
          }
      })
      .catch((err) => {
           swal("There was an error!","more error details", "warning");
      });
    }        

  //use to reset the values
async function onKeyPressed(e) {
  if(e.key === "Backspace")
  { 
    setpage(1);
    setpages(1);
  }
}

let findl=find.length   
useEffect(()=>{
  if(findl>0){
      searchuser()
  }else{
    view_user()
  }
},[page,pages,findl])


  const columns = [
    {
        name:'User Id',
        selector:"uid",
        sortable:true
    },
    {
        name: 'Profile',
        selector: 'profile',
        cell: row => {
            return (
              <div className="tblImgOut"> 
                <img src={process.env.PUBLIC_URL + `/uploads/${row.profile}`} alt="img" className="readndrollimg"/> 
              </div>
            )
        }
    },
    {
        name: 'First Name',
        selector:"fname",
    },
    {
        name: 'Last Name',
        selector:"lname",
    },
    {
        name: 'Email',
        selector:"email",
    },
    {
        name: 'Contact',
        selector:"mobile_no",
    },
    {
        name: 'Action',
        cell:row=> {
            return(
            <div className="tabButOut">
                <Button onClick={()=>history.push("/edituser/"+row.uid)} startIcon={<ModeEditOutlineIcon/>}/>
                <Button onClick={()=>handleClickOpen(row.uid)}  startIcon={<DeleteIcon/>}/>
            </div>
            )
        }
    },

];

  return (
 
    <Box>
        <Sidebar/>
         <Paper spacing={3} className="datatable">
         <Box className='align'>
            <TextField type="text" value={find} placeholder='Search Here..' className="myInputSearch"
            onKeyDown={onKeyPressed}
            tabIndex="0"
            onChangeCapture={(e)=>setfind(e.target.value)} />
            {/* <Button className="btn-manage"  variant="contained" color="primary" onClick={()=>history.push("/Register-user")}>
             Add New User
             </Button> */}
        </Box>
        <div className='tbl'>
        {
          (findl>0)?<DataTable
          title="Manage Users"
             columns={columns}
             data={search.data}
             pagination
             paginationServer
             paginationDefaultPage={1}
             paginationPerPage={perpage}
             paginationTotalRows={search.total}
             onChangePage={pages=>setpages(pages)}
             paginationComponentOptions={{ noRowsPerPage:true }}
            
         /> :   
        <DataTable
        title="Manage Users "
            columns={columns}
            data={info.data}
            pagination
            paginationServer
            currentPage={page}
            paginationDefaultPage={1}
            paginationResetDefaultPage={1}
            paginationPerPage={perpage}
            paginationTotalRows={info.total}
            onChangePage={page=>setpage(page)}
            paginationComponentOptions={{ noRowsPerPage:true }}
           
        />
        }
</div>
       <Box>
       <Dialog
        open={open}
        maxWidth='md'
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you Sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to delete ? 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>NO</Button>
          <Button onClick={delete_user}  >
              YES
        </Button>
        </DialogActions>
      </Dialog>
   </Box>
   </Paper>  
    </Box>
      
  );
}