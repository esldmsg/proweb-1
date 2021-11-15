import react, {useEffect, useContext} from 'react'
import { Table } from 'react-bootstrap'
import {ProductContext} from '../ProductContext';
import ProductRow from './ProductRow';
import ItemCard from './ItemCard'




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
        
            <section className="py-4 container">
                <div className = "row justify-content-center">
                    {products.data.map((item, index) => (
                                <ItemCard
                                        id = {item.id}
                                        title = {item.title}
                                        description = {item.description}
                                        price = {item.price}
                                        key={index}
                                        item={item}
                                />
                    ))}
                </div>
            </section>
           
        
      
         
      );
}

export default Store;