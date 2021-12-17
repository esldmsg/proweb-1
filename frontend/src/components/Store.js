import react, {useEffect, useContext, useState} from 'react'
import {ProductContext} from '../ProductContext';
import ItemCard from './ItemCard';
import {  Container} from 'react-bootstrap';
import {UserContext} from '../UserContext';
import{ Redirect} from "react-router-dom";
import ErrorMessage from './ErrorMessage';



const Store = () => {
    const[token]  = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [products, setProducts]  =  useContext(ProductContext)

    useEffect( () => {
        fetch('http://localhost:8000/allitems/?skip=0&limit=100')
           .then(resp => {
               console.log(resp)
            if(!resp.ok){
                setErrorMessage("Something went wrong")}
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
        <Container fluid>
            <section className="py-4 container">
                                <ErrorMessage message={errorMessage}/>
                <div className = "row justify-content-center">
                    {products.data.map((item, index) => (
                                <ItemCard
                                        id = {item.id}
                                        title = {item.title}
                                        description = {item.description}
                                        price = {item.price}
                                        url = {item.url}
                                        key={index}
                                        item={item}
                                />
                    ))}
                </div>
            </section>
            </Container>
        
      
         
      );
}

export default Store;