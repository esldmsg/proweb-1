import react, {useEffect, useContext, useState} from 'react'
import { Table, Container, Row, Col } from 'react-bootstrap'
import './cart.css'
import {UserContext} from '../UserContext';
// import { PaystackConsumer } from 'react-paystack';
import ErrorMessage from './ErrorMessage';
import{ Redirect} from "react-router-dom"




const Cart = () => {
    const[token]  = useContext(UserContext);
    const [totalItem, setTotalItem] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [carts, setCarts]  =  useState([
       { id:"",
        title:"",
        price: "",
        rate: "",
        url:"",
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
            if(!response.ok){
                setErrorMessage("Could not ge Cart");
            }else{
                const data = await response.json()
               setCarts([...data]
            }
        };
        getCart();
    }, [])
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
      let handleQuantityIncrease = (index, price, rate) => {
          let newItems = [...carts]
          newItems[index].rate =(+price +  +rate);
          setCarts(newItems);
          calculateTotal();
      }
      const handleQuantityDecrease = (index, price, rate) => {
        if (rate <= 0  ){
            let newItems = [...carts]
            newItems[index].rate = 0;
            setCarts(newItems);
		}else{
        let newItems = [...carts]
        newItems[index].rate = rate - price;
        setCarts(newItems);
        calculateTotal();
    }
}

     const calculateTotal = () => {
         const totalItem = carts.reduce((total, cart) =>{
             return total + cart.rate
         }, 0);
         setTotalItem(totalItem);
        
     }


     const pay = async (rate) => {
        console.log(rate)
        const requestOptions = {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                Authorization: "Bearer " + token,
                'cache-control':'no-cache'
            },
            body: JSON.stringify({
              
                rate
              
             }),
         
        };
        const response = await fetch ("http://localhost:8000/pay/{rate}", requestOptions);
        const data = await response.json() 
        if(!response.ok){
            setErrorMessage(data.detail)
        }else{
            setErrorMessage("You are ready to pay")
    }
}
        // const shipped = carts.filter(carts => carts.rate > 1);
        // console.log([...shipped]);
       
        if (token === 'null') {
            return <Redirect to ="/"/>;
        }
       
      return(
          <div>
            <Container>
            <Row>
                
                <Col>
                <ErrorMessage message={errorMessage}/>
                
                    <Table striped bordered hover>
                    
                        <thead>
                            
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Product Description</th>
                                <th>Unit Price</th>
                                <th>Rate</th>    
                            </tr>
                        </thead>
                        <tbody>
                        {carts.map((cart, index) => (
                               <tr>
                                   <td><img style={{height:"100px",width:"100px"}} src={cart.url}/></td>
                                   <td>{cart.title}</td>
                                   <td>{cart.description}</td>
                                   <td>{cart.price}</td>
                                   <td>{cart.rate}</td>
                                   <td>
                                   <button onClick={() => handleQuantityIncrease(index, cart.price, cart.rate)}  className = "btn btn-outline-info btn-sm mr-2">+</button>
                                   <button onClick={() => handleQuantityDecrease(index, cart.price, cart.rate)}  className = "btn btn-outline-info btn-sm mr-2">-</button>
                                   <button onClick={() => handleDelete(cart.id)}  className = "btn btn-outline-danger btn-sm mr-2">Delete</button> 
                                   <button onClick={() => pay(cart.id,cart.title,cart.price, cart.rate, cart.description, cart.url)} className = "btn btn-outline-info btn-sm mr-2"> Pay </button>
                                  </td>

                               </tr>
                    ))}
                        </tbody>
                        
                    </Table>
                </Col>
            </Row>
            <div>
            
                <h4>TOTAL: {totalItem} </h4> 
            </div>
            </Container>
            </div>

         
      );
}

export default Cart;