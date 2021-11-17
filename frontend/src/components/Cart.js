import react, {useEffect, useContext, useState} from 'react'
import { Table } from 'react-bootstrap'
import {UserCartContext} from '../UserCartContext';
import {UserContext} from '../UserContext';
import CartRow from './CartRow';
import ErrorMessage from './ErrorMessage';



const Cart = () => {
    const [token] = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [carts, setCarts]  =  useContext(UserCartContext)




    useEffect( () => {
        fetch('http://localhost:8000/items')
           .then(resp => {
               console.log(resp)
               return resp.json();
        }).then(results => {
            console.log(results)
            setCarts({"data": [...results] })
        })
    }, [])
    // console.log(products.data)

    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "content-Type": "application/json"
            },
        };
        const response = await fetch ("http://localhost:8000/delete/admin/" + id, requestOptions);
        console.log(response)
        if(!response.ok){
            setErrorMessage("somethin went wrong")
        }else{
            const filteredcarts = carts.data.filter((carts) => carts.id !== id);
            setCarts({ data: [...filteredcarts] })
            setErrorMessage("Items successfully Deleted");
        }

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
                                
                                
                            </tr>
                        </thead>
                        <tbody>
                        {carts.data.map((cart) => (
                            <CartRow
                                    id = {cart.id}
                                    title = {cart.title}
                                    description = {cart.description}
                                    price = {cart.price}
                                    key={cart.id}
                                    handleDelete={handleDelete}
                            />
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            

         
      );
}

export default Cart;