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
import moment from 'moment/moment.js'



export default function ViewOrder() {
    const history=useHistory();
    const[info,setinfo]=useState([]);
    const[page,setpage]=useState(1);
    const[perpage,setperpage]=useState(5);    

    async function view_order() {
        let bodyFormData=new FormData();
        makeGetRequest(`/manageorder?page=${page}&perpage=${perpage}&delay=1`,bodyFormData).then((response)=> {
            if(response.data.status === "1") {
                  setinfo(response.data);
            }
            else {
              setinfo([]);
            }
        })
        .catch((err) => {
             swal("There was an error!","more error details", "warning");
        });
    }

   
useEffect(()=>{
  
    view_order()
},[page])


  const columns = [
    {
        name:'Order Id',
        selector:"oid",
        sortable:true
    },
    
    {
        name: 'User Name',
        selector:"fname",
    },

    {
        name: 'Product name',
        selector:"pname",
    },

    {
        name: 'Price',
        selector:"price",
    },
    {
        name: 'Order Date',
        selector:"created_at",
        cell:row=> {
            return(
            <div>
                {moment(row.created_at).format("lll")}
            </div>
            )
        }
    },
    {
        name: 'Payment mode',
        selector:"pay_mode",
    },
    {
        name: 'Order status',
        selector:"status",
    },
    {
        name: 'Action',
        cell:row=> {
            return(
            <div>
                {(row.status=="order placed")?
                <button onClick={()=>changestatus(row.oid,"out for delivery")}>out for delivery</button>
                :(row.status=="out for delivery")?
                <button onClick={()=>changestatus(row.oid,"delivered")}>delivered</button>
                :<div>Completed</div>
                }
            </div>
            )
        }
       
    },

];

function changestatus(id,status){
    let bodyFormData = new FormData();
    bodyFormData.append("status",status);
    makePostRequest("/status/"+id, bodyFormData).then((response) => {
        if (response.data.status === "1") {
           window.location.reload()
          }else{  
            swal("Error","error", "warning"); 
          }
        
      }).catch((err) => {
        swal("There was an error!", "more error details", "warning");
      });

}

  return (
 
    <Box>
        <Sidebar/>
         <Paper spacing={3} className="datatable">
         <div className='tbl'>
       <DataTable
        title="Manage Orders "
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
</div>
       <Box>
      
   </Box>
   </Paper>  
    </Box>
      
  );
}