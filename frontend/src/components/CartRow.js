import React, {useState} from 'react';



function CartRow ({ id, title, description, price, handleDelete}) {

	let [rate, setRate] = useState(0);
	let [quantity, setQuantity] = useState(0);
	let [total, setTotal] = useState(localStorage.getItem("money"));

    const increase = async () => {
	   rate = price + rate
	   setRate(rate)
	   quantity = quantity + 1
	   setQuantity(quantity)
	   let x = localStorage.getItem("money")
		total = parseInt(+price + +x)
		localStorage.setItem("money", total);
		setTotal(total)
		//console.log(total)
	   }
	
	const decrease = async () => {
		if (rate == 0 ){
			setRate(0)
		}else{
		rate = rate -price
		setRate(rate)
		quantity =quantity -1
		setQuantity(quantity)
		let x = localStorage.getItem("money")
		total = parseInt(+x - +price)
		localStorage.setItem("money", total);
		setTotal(total)
		//console.log(total)
	
	}
	}
	//console.log(rate);
	console.log(title)
	console.log(total);
	
		return(
			
		
			<tr>
				
				<td>{id}</td>
				<td>{title}</td>
				<td>{description}</td>
				<td>{price}</td>
				<td>{rate}</td>
                <td>{quantity}</td>
                <td>	
                <button onClick={() => handleDelete(id)} className = "btn btn-outline-danger btn-sm mr-2">Remove</button>
				<button onClick= {increase}  className = "btn btn-outline-success btn-sm mr-2">+</button>
				<button onClick={() => decrease()}  className = "btn btn-outline-success btn-sm mr-2">-</button>
              </td>
			 
            </tr>
         
		);


}
export default CartRow;