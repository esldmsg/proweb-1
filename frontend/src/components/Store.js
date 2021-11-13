import react, {useEffect, useContext} from 'react'
import { Table } from 'react-bootstrap'
import {ProductContext} from '../ProductContext';
import ProductRow from './ProductRow';



const Store = () => {
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
    console.log(products.data)
      return(
          
            <div className ="row">
                <div className = "col-sm-10 col-xm-12 mr-auto ml-auto mt-4 mb-4">
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
                            <ProductRow
                                    id = {product.id}
                                    title = {product.title}
                                    description = {product.description}
                                    price = {product.price}
                                    key={product.id}
                            />
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            

         
      );
}

export default Store;