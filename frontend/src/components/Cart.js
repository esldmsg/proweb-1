import react, {useEffect, useContext, useState} from 'react'
import { Table, Container, Row, Col } from 'react-bootstrap'
import './cart.css'
import {UserContext} from '../UserContext';
import { usePaystackPayment } from 'react-paystack';
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
           console.log(response)
           console.log(token)
            if(!response.ok){
                setErrorMessage("Could not ge Cart");
            }else{
                const data = await response.json();
                //console.log(data)
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
        if (rate <= 0  ){
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


    //  const pay = async () => {
    //     //console.log(title, price, description)
    //     const requestOptions = {
    //         method: "GET",
    //         headers:{
    //             "Content-Type":"application/json",
    //             Authorization: "Bearer " + token,
    //             'cache-control':'no-cache'
    //         },
          
    //     };
    //     const response = await fetch ("http://localhost:8000/payment/", requestOptions);
    //     const data = await response.json()
    //     console.log(data)
    //     if(!response.ok){
    //         setErrorMessage(data.detail)
    //     }else{
            
    //   }
    const config = {
        reference: (new Date()).getTime().toString(),
        email: "user@example.com",
        amount: totalItem *100,
        publicKey: 'pk_test_a2a08405b2f3f7f1046e010e11b4c0bfbbb7024b',
        };
        
        // you can call this function anything
        const onSuccess = (reference) => {
        // Implementation for whatever you want to do with reference and after success call.
        //setErrorMessage("payment successfull")
    const shipped = async (title, price,rate, description) => {
        console.log([...carts])
        const requestOptions1 = {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                title:carts.title,
                price:carts.price,
                rate:carts.rate,
                description:carts.description,
               
             }),
             
        };
        const response = await fetch ("http://localhost:8000/shipped/{title}/{price}/{rate}/{description}/", requestOptions1);
        const data =  response.json()
        console.log(data)
        if(!response.ok){
            setErrorMessage(data.detail)
        }else{
            setErrorMessage("Payment successfull and Item Added to Cart");
     
        }
    }
        console.log(reference);
        shipped()
        };
    
        // you can call this function anything
        const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
        }
  
        const initializePayment = usePaystackPayment(config);
        if (token === 'null') {
            return <Redirect to ="/"/>;
        }
    
      return(
          <div>
            <script src="https://js.paystack.co/v1/inline.js"></script>
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
                                   <td>{cart.url}</td>
                                   <td>{cart.title}</td>
                                   <td>{cart.description}</td>
                                   <td>{cart.price}</td>
                                   <td>{cart.rate}</td>
                                   <td>
                                   <button onClick={() => handleQuantityIncrease(index, cart.price, cart.rate)}  className = "btn btn-outline-info btn-sm mr-2">+</button>
                                   <button onClick={() => handleQuantityDecrease(index, cart.price, cart.rate)}  className = "btn btn-outline-info btn-sm mr-2">-</button>
                                   <button onClick={() => handleDelete(cart.id)}  className = "btn btn-outline-danger btn-sm mr-2">Delete</button> 
                                   <button onClick={() => {initializePayment(onSuccess, onClose)}} className = "btn btn-outline-info btn-sm mr-2"> Pay </button>
                                  </td>

                               </tr>
                    ))}
                        </tbody>
                        
                    </Table>
                </Col>
            </Row>
            </Container>
            </div>

         
      );
}

export default Cart;