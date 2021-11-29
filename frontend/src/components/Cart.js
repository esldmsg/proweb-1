import react, {useEffect, useContext, useState} from 'react'
import { Table, Container, Row, Col } from 'react-bootstrap'
import './cart.css'
import {UserContext} from '../UserContext';
import { usePaystackPayment } from 'react-paystack';
import ErrorMessage from './ErrorMessage';
import{ Redirect} from "react-router-dom"




const Cart = () => {
    const [config, setConfig] = useState({
        email:"",
        amount:"",
        publicKey: 'pk_test_a2a08405b2f3f7f1046e010e11b4c0bfbbb7024b',
    });
    const [Email, setEmail]  =  useState('');
    const [totalRate, setTotalRate] =  useState(0);
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
    
    // const config = {
    //     email: Email,
    //     amount: totalRate,
    //     publicKey: 'pk_test_a2a08405b2f3f7f1046e010e11b4c0bfbbb7024b',
    //     };
    var email = "";
    var amount = "";
    var publicKey ="";
    console.log(config);
    const initializePayment = usePaystackPayment(email=Email,amount=totalRate, publicKey='pk_test_a2a08405b2f3f7f1046e010e11b4c0bfbbb7024b');
    const onSuccess = () => {
        setErrorMessage("payment successfull")
    }
    const onClose = () => {
            console.log('closed')
            }   




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


     const pay = async (id, title, price, rate, description, url) => {
       setTotalRate(rate)
        const requestOptions = {
            method: "GET",
            headers:{
                "Content-Type":"application/json",
                Authorization: "Bearer " + token,
                'cache-control':'no-cache'
            },
         
        };
        const response = await fetch ("http://localhost:8000/payment/", requestOptions);
        const data = await response.json() 
        console.log(data.email)
        setEmail(data.email)
        setConfig({
          email:data.email,
          amount: rate*100  
        })
        if(!response.ok){
            setErrorMessage(data.detail)
        }else{
          initializePayment(onSuccess, onClose)   
     }
    }
   
        // const shipped = carts.filter(carts => carts.rate > 1);
        // console.log([...shipped]);
        const ship = async (id, title, price, rate, description, url) => {
            const requestOptions = {
                method: "POST",
                headers:{
                    "content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                   title,
                   price,
                   rate, 
                   description
                }),
            }
            const response = await fetch ("http://localhost:8000/shipped/{title}/{price}/{rate}/{description}", requestOptions);
            const data = await response.json()
            console.log(data)
            if(!response.ok){
                setErrorMessage(data.detail)
            }else{
                setErrorMessage("Item successfully Added to shipped");
         
            }
    
        }
    
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