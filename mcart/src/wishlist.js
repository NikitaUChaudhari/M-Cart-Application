import { useHistory } from "react-router-dom";
import { useState,useEffect } from "react";
import Dashboard from "./user/dashboard";
import { makeGetRequest,makePostRequest} from './util/utils';
import swal from "sweetalert";
import { useDispatch } from "react-redux";
import { addcart } from './features/cart'


function WishList() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [data,setdata]=useState([])
    
    async function viewallProduct(){
        let bodyFormData = new FormData();
        makeGetRequest(`/viewallwishlist?uid=${localStorage.getItem("user_id")}`, bodyFormData).then((response) => {
            if(response.data.status === "1") {
                setdata(response.data.data)
            }else{
                setdata([])
            }    
        }).catch((err) => {
          swal("There was an error!", "more error details", "warning");
        });
      }

      


      
     async function addToCart(data){
        dispatch(addcart(data))
        history.push('/cart')
    }

   
    

      useEffect(()=>{
        viewallProduct()
      },[])
    return (
<div>
 <Dashboard/>

<section className="product" >
    <h2 className="text-center">My Wishlist</h2>
  <div className="container py-5">
      
  { (data.length>0)?data.map(p=>
    (<div className="row justify-content-center mb-3">
      <div className="col-md- col-xl-10">
        <div className="card shadow-0 border rounded-3">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                <div className="bg-image hover-zoom ripple rounded ripple-surface">
                 <img src={process.env.PUBLIC_URL + `/uploads/products/${p.img}`} alt="img" className="w-100"/> 
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-6">
                <h5>{p.pname}</h5>
                <div className="d-flex flex-row">
                  <div className="text-danger mb-1 me-2">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                </div>
                <div className="mt-1 mb-0 text-muted small">
                  <span className="text-primary"> • </span>
                  <span>{p.pdescription}</span>
                </div>
                
                <p className="text-truncate mb-4 mb-md-0">
                 {p.category}
                </p><br/>
                <button className="btn btn-primary" type="button"> Details</button>
              </div>
              <div className="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
                <div className="d-flex flex-row align-items-center mb-1">
                  <h4 className="mb-1 me-1">₹{p.price}</h4>
                </div>
                <h6 className="text-success">Free shipping</h6>
                <div className="d-flex flex-column mt-4">
                  <button className="btn btn-primary btn-sm"  onClick = {() => addToCart(p)}>Add To Cart</button>
                  {/* <button className="btn btn-outline-primary btn-sm mt-2" type="button" onClick = {()=>Wishlist(p.pid)}>
                    Add to wishlist
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ))
  :<p className="text-center">No data found</p>
  }
  </div>
</section>
</div>

    );
  }
  
  export default WishList;
  