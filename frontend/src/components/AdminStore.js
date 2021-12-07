import react, {useEffect, useContext, useState} from 'react'
import { Table, Container, Row, Col } from 'react-bootstrap'
import {ProductContext} from '../ProductContext';
import AdminRow from './AdminRow';
import ErrorMessage from './ErrorMessage'
import SuccessMessage from './SuccessMessage'
import {UserContext} from '../UserContext';


const AdminStore = () => {
    const [token] = useContext(UserContext);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [products, setProducts]  =  useContext(ProductContext)



    useEffect( () => {
        fetch('http://localhost:8000/allitems/?skip=0&limit=100')
           .then(resp => {
               console.log(resp)
               return resp.json();
        }).then(results => {
            console.log(results)
            setProducts({"data": [...results] })
        })
    }, [])
    // console.log(products.data)

    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch ("http://localhost:8000/delete/admin/" + id, requestOptions);
        const data = await response.json()
        console.log(data.detail)
        if(!response.ok){
            setErrorMessage(data.detail)
        }else{
            const filteredProducts = products.data.filter((product) => product.id !== id);
            setProducts({ data: [...filteredProducts] })
            setSuccessMessage("Items successfully Deleted");
        }

    }



      return(
            
            
                <div>
                <ErrorMessage message={errorMessage}/>
                <SuccessMessage message={successMessage}/>
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
                        {products.data.map((product) => (
                            <AdminRow
                                    id = {product.id}
                                    title = {product.title}
                                    description = {product.description}
                                    price = {product.price}
                                    key={product.id}
                                    handleDelete={handleDelete}
                            />
                        ))}
                        </tbody>
                    </Table>
                    </div>
      );
}

export default AdminStore;