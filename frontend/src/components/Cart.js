import react, {useEffect, useContext, useState} from 'react'
import { Table, Container, Row, Col } from 'react-bootstrap'
import './cart.css'
import {UserContext} from '../UserContext';
import { usePaystackPayment } from 'react-paystack';
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
        console.log([...carts])
        const requestOptions1 = {
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify([...carts]),
             
        };
        const response = fetch ("http://localhost:8000/shipped{title}/{price}/{rate}/{description}/", requestOptions1);
        const data =  response.json()
        console.log(data)
        if(!response.ok){
            setErrorMessage(data.detail)
        }else{
            setErrorMessage("Payment successfull and Item Added to Cart");
     
        }
        console.log(reference);
        };
    
        // you can call this function anything
        const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
        }
  
        const initializePayment = usePaystackPayment(config);
      return(
          <div>
            <Container>
            <Row>
                
                <Col>
                <ErrorMessage message={errorMessage}/>
                
                    <Table striped bordered hover>
                    
                        <thead>
                            
                            <tr>
                                <th>Product Name</th>
                                <th>Product Description</th>
                                <th>Unit Price</th>
                                <th>Rate</th>    
                            </tr>
                        </thead>
                        <tbody>
                        {carts.map((cart, index) => (
                               <tr>
                                   <td>{cart.title}</td>
                                   <td>{cart.description}</td>
                                   <td>{cart.price}</td>
                                   <td>{cart.rate}</td>
                                   <td>
                                   <button onClick={() => handleQuantityIncrease(index, cart.price, cart.rate)}  className = "btn btn-outline-info btn-sm mr-2">+</button>
                                   <button onClick={() => handleQuantityDecrease(index, cart.price, cart.rate)}  className = "btn btn-outline-info btn-sm mr-2">-</button>
                                   <button onClick={() => handleDelete(cart.id)}  className = "btn btn-outline-danger btn-sm mr-2">Delete</button> 
                                   </td>

                               </tr>
                    ))}
                        </tbody>
                        
                    </Table>
                    <div>TOTAL = {totalItem}</div> <button onClick={() => {initializePayment(onSuccess, onClose)
            }} className = "btn btn-outline-info btn-sm mr-2"> Pay </button>
                </Col>
            </Row>
            </Container>
            </div>

         
      );
}

export default Cart;