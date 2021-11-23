import react, {useEffect, useContext} from 'react'
import {ProductContext} from '../ProductContext';
import ItemCard from './ItemCard';
import {UserContext} from '../UserContext';
import{ Redirect} from "react-router-dom";



const Store = () => {
    const[token]  = useContext(UserContext);

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
    if (token === "null" ){
        return <Redirect to ="/"/>;
    }

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