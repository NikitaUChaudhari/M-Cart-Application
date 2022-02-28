import { createSlice } from '@reduxjs/toolkit';
import swal from "sweetalert";

const initialState = {
    cartItems : localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addcart: (state, action) => {
			const itemIndex = state.cartItems.findIndex( 
				(item) => item.pid === action.payload.pid
			);

			if(itemIndex >= 0){
				state.cartItems[itemIndex].cartQuantity += 1;
				//swal("Success", `Increased ${state.cartItems[itemIndex].pname} Product Quantity`, "success");
			} else {
				const tempProduct = {...action.payload, cartQuantity: 1};
            	state.cartItems.push(tempProduct);
				//swal('Success', `${action.payload.pname} added to cart`, 'success');
			}
			localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        },

		removeFromCart: (state, action) => {
			const nextCartItems = state.cartItems.filter(
				cartItem => cartItem.pid !== action.payload.pid
			)

			state.cartItems = nextCartItems;
			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
			//swal('Success', `${action.payload.pname} removed from cart`, 'success');
		},

		decreaseCart: (state, action) => {
			const itemIndex = state.cartItems.findIndex(
				cartItem => cartItem.pid === action.payload.pid
			)

			if(state.cartItems[itemIndex].cartQuantity > 1){
				state.cartItems[itemIndex].cartQuantity -= 1;
				//swal('Quantity Decreased', `Decreased ${action.payload.pname} cart quantity`, 'info');
			} else if(state.cartItems[itemIndex].cartQuantity === 1){
				const nextCartItems = state.cartItems.filter(
					cartItem => cartItem.pid !== action.payload.pid
				);
	
				state.cartItems = nextCartItems;
				//swal('Success', `${action.payload.pname} removed from cart`, 'success');
			}
			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
		},

		clearCart: (state, action) => {
			state.cartItems = [];
			//swal('Success', 'Cart Cleared Successfully', 'success');
			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
		},
		getTotals: (state, action) => {
			let { total, quantity } = state.cartItems.reduce((cartTotal, cartItem) => {
				const { price, cartQuantity } = cartItem;
				const itemTotal = price * cartQuantity;
				cartTotal.total += itemTotal
				cartTotal.quantity += cartQuantity
				return cartTotal
			}, 
			{
				total: 0,
				quantity: 0
			});

			state.cartTotalQuantity = quantity;
			state.cartTotalAmount = total;
		}
    },
});

export const { addcart, removeFromCart, decreaseCart, clearCart, getTotals } = cartSlice.actions;

export default cartSlice.reducer;