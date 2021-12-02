import react, {useEffect, useContext, useState} from 'react'
import { Table, Container, Row, Col } from 'react-bootstrap'
import './cart.css'
import {UserContext} from '../UserContext';
import ErrorMessage from './ErrorMessage';
import{ Redirect} from "react-router-dom"




const Shipped = () => {
    const[token]  = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [ships, setShips]  =  useState([
       { id:"",
        title:"",
        price: "",
        rate: "",
        url:"",
        description:"",
    }
    ]);
    
    
    useEffect( () => {    
     const getShip = async () => {
        const requestOptions = {
            method: "GET",
            headers:{
                "Content-Type":"application/json",
                Authorization: "Bearer " + token,
            },
        };
            const response = await fetch('http://localhost:8000/shipping/?skip=0&limit=100', requestOptions);
            if(!response.ok){
                setErrorMessage("Could not ge Ship");
            }else{
               const data = await response.json();
               setShips([...data])
               }
        }
        getShip();
    }, [token])
    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch ("http://localhost:8000/shipping/delete/" + id, requestOptions);
        console.log(response)
        if(!response.ok){
            setErrorMessage("somethin went wrong")
        }else{
            const filteredships = ships.filter((ships) => ships.id !== id);
            setShips([...filteredships])
            setErrorMessage("Items successfully Deleted");
        }

    }
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
                                <th>Amount Paid</th>    
                            </tr>
                        </thead>
                        <tbody>
                        {ships.map((ship, index) => (
                               <tr>
                                   
                                   <td ><img style={{height:"100px",width:"100px"}} src={ship.url}/></td>
                                   <td>{ship.title}</td>
                                   <td>{ship.description}</td>
                                   <td>{ship.rate}</td>
                                   <td>
                                   <button  key={index} onClick={() => handleDelete(ship.id)}  className = "btn btn-outline-danger btn-sm mr-2">Confirm Order Recieved</button> 
                                  </td>

                               </tr>
                    ))}
                        </tbody>
                        
                    </Table>
                </Col>
            </Row>
            <div>
            </div>
            </Container>
            </div>

         
      );
}

export default Shipped;