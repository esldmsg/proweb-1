import react, {useEffect, useContext, useState} from 'react'
import { Table } from 'react-bootstrap'
import {UserCartContext} from '../UserCartContext';
import {UserContext} from '../UserContext';
import CartRow from './CartRow';
import ErrorMessage from './ErrorMessage';



const Cart = () => {
    const [totalItem, setTotalItem] = useState(0);
    const [token] = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [carts, setCarts]  =  useState([
       { id:"",
        title:"",
        price: "",
        rate: "",
        description:"",
    }
    ]);
   
    




    useEffect( () => {    
     const getCart = async () => {
        const requestOptions ={
            method: "GET",
            headers:{
                "Content-Type":"application/json",
                Authorization: "Bearer " + token,
            },
        };
            const response = await fetch('http://localhost:8000/items/?skip=0&limit=100', requestOptions);
           console.log(response)
           console.log(token)
            if(!response.ok){
                setErrorMessage("Could not ge Cart");
            }else{
                const data = await response.json();
                console.log(data)
               // setCarts({"data": [...data]})
               setCarts([...data])
            
                localStorage.setItem("money", 0);
            }
        };
        getCart();
    }, [token])
    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch ("http://localhost:8000/delete/" + id, requestOptions);
        console.log(response)
        if(!response.ok){
            setErrorMessage("somethin went wrong")
        }else{
            const filteredcarts = carts.filter((carts) => carts.id !== id);
            setCarts([...filteredcarts])
            setErrorMessage("Items successfully Deleted");
        }

    }
   
    // const increase = async (price) => {
    //        //const newItems = [carts];
    //       // newItems[id].cart.price++;
    //       let rate = price + price
    //        setCarts(rate)
    //        console.log(rate)

        // rate = price + rate
        // setRate(rate)
        // quantity = quantity + 1
        // setQuantity(quantity)
        // let x = localStorage.getItem("money")
        //  total = parseInt(+price + +x)
        //  localStorage.setItem("money", total);
        //  setTotal(total)
        //  //console.log(total)
       // }
   
      
       console.log(carts)
       //let price = carts.price+carts.price
       //console.log(carts.price)
      let handleQuantityIncrease = (index, price, rate) => {
          console.log(rate)
          let newItems = [...carts]
          newItems[index].rate =(+price +  +rate);
          setCarts(newItems);
          calculateTotal();
          //console.log(newItems)
      }

      const handleQuantityDecrease = (index, price, rate) => {
        if (rate == 0 ){
            let newItems = [...carts]
            newItems[index].rate = 0;
            setCarts(newItems);
		}else{
        let newItems = [...carts]
        newItems[index].rate = rate - price;
        setCarts(newItems);
        calculateTotal();
        //console.log(newItems)
    }
}

     const calculateTotal = () => {
         const totalItem = carts.reduce((total, cart) =>{
             return total + cart.rate
         }, 0);
         setTotalItem(totalItem);
         console.log(totalItem)
     }
      return(
            
            <div className ="row">
                
                <div className = "col-sm-10 col-xm-12 mr-auto ml-auto mt-4 mb-4">
                <ErrorMessage message={errorMessage}/>
                
                    <Table striped bordered hover>
                    
                        <thead>
                            
                            <tr>
                                <th>id</th>
                                <th>Product Name</th>
                                <th>Product Description</th>
                                <th>Unit Price</th>
                                <th>Rate</th>
                                
                                
                            </tr>
                        </thead>
                        <tbody>
                        {carts.map((cart, index) => (
                               <tr>
                                   <td>{cart.id}</td>
                                   <td>{cart.title}</td>
                                   <td>{cart.description}</td>
                                   <td>{cart.price}</td>
                                   <td>{cart.rate}</td>
                                   <td>
                                   <button onClick={() => handleDelete(cart.id)}  className = "btn btn-outline-danger btn-sm mr-2">Delete</button> 
                                   <button onClick={() => handleQuantityIncrease(index, cart.price, cart.rate)}  className = "btn btn-outline-danger btn-sm mr-2">+</button>
                                   <button onClick={() => handleQuantityDecrease(index, cart.price, cart.rate)}  className = "btn btn-outline-danger btn-sm mr-2">-</button>
                                   </td>

                               </tr>
                    ))}
                        </tbody>
                        <div>TOTAL = {totalItem}</div>
                    </Table>
                </div>
            </div>
            
            

         
      );
}

export default Cart;